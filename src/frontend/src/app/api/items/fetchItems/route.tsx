import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';
import { Method, SpecificItemsStructure } from "../../../../components/DataStructure";
import queryString from 'query-string';
import { sanitizeInput } from '../../../../components/Sanitiser';

// API used to fetch all the bins & its info according to home council selected:
export async function GET(req: NextRequest) {
    //sanitise the parameters:
    const queryParams = queryString.parseUrl(req.url).query;

    // first determine the council id associated with that council name:
    const homeCouncil = sanitizeInput(queryParams.specificCouncil);
    const homeID = await prisma.council.findFirst({
        where: {
            name: homeCouncil as string,
        },
        select: {
            id: true,
        }
    })
    if (homeID == null) {
        return NextResponse.json({ "error": "requesting bins do not have a valid council (not found)" })
    }
    try {
        const data = await prisma.item.findMany({
            where: {
                methods: { // filtering through methods that only select items that have a matching council id
                    some: {
                        councilId: homeID.id,
                    },
                },
            },
            select: { // Select its basic info and the methods
                name: true,
                methods: {
                    where: {
                        councilId: homeID.id,
                    },
                    select: { // need the method name from the recycling method table
                        method: true,
                        note: true,
                        address:true,
                        bin: {
                            select: {
                                type: true,
                            }
                        }
                    }
                },
            },
        });

        // Preprocessing the data in prioritized order before passing to the client-side:
        // Current standard across items: Recycling -> Green -> Glass -> drop_off only (e.g., batteries) ->FOGO -> General waste
        // Current standard within item: collection then drop off alphabetically 
        const recyclingItems: SpecificItemsStructure[] = [];
        const greenItems: SpecificItemsStructure[] = [];
        const glassItems: SpecificItemsStructure[] = [];
        const dropOffOnlyItems: SpecificItemsStructure[] = [];
        const FOGOItems: SpecificItemsStructure[] = [];
        const generalWasteItems: SpecificItemsStructure[] = [];

        // loop through each record of item
        data.forEach((record: SpecificItemsStructure) => {

            // separate the methods of drop off and records of collection:
            const collection_methods: Method[] = [];
            const dropOff_methods: Method[] = [];

            // Determine which type of item this is:
            let record_type = "undefined";

            // loop through method to determine the 
            record.methods.forEach((method: Method) => {
                // if the current method is to be dropped off, then push to the drop off array 
                if (method.bin == null) {
                    dropOff_methods.push(method);
                }
                // if this is the collection method, then update the type of item and push
                else {
                    record_type = method.bin.type;
                    collection_methods.push(method);
                }
            });

            // after sorting sorting the methods, push this record according to its type:
            record.methods = collection_methods.concat(dropOff_methods);
            if (record_type == "Recycling-Bin") {
                recyclingItems.push(record);
            }
            else if (record_type == "General-Waste-Bin") {
                generalWasteItems.push(record);
            }
            else if (record_type == "Green-Waste-Bin") {
                greenItems.push(record);
            }
            else if (record_type == "Food-Waste-Bin") {
                FOGOItems.push(record);
            }
            else if (record_type == "Glass Recycling Bin") {
                glassItems.push(record);
            }
            else { // if cannot be collected, then should be displayed 
                dropOffOnlyItems.push(record);
            }
        });

        // return JSON version of it 
        const processedData = recyclingItems.concat(greenItems).concat(glassItems).concat(dropOffOnlyItems).concat(FOGOItems).concat(generalWasteItems);
        return NextResponse.json(processedData);

    } catch (error) {
        return NextResponse.json(error);
    }
}
