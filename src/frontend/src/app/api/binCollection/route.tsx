import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../utils/prisma';
import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "../../../components/Sanitiser";
import queryString from "query-string";


const Errors = {
    error: "Something went wrong.",
  };
  
export type binDaysData = {
        id: number;
      councilId: number;
        dayName: string;
        binType: number;
        frequency: string;
        collectDate: string;
        specialCollectNote: string;
  };
  export type ResponseData = Array<binDaysData> | typeof Errors;
 
// API used to fetch all the bins & its info according to council selected:
export async function GET(req: NextRequest) {
    
    //sanitise the parameters:
    const queryParams = queryString.parseUrl(req.url).query;

    // first determine the council id associated with that council name:
    const homeCouncil = sanitizeInput(queryParams.councilId);
    if (!homeCouncil || homeCouncil === "") {
        return NextResponse.json({ "error": "The 'councilId' parameter is missing or null" });
    }
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
    else { try {
        const binDayData = await prisma.binCollectDates.findMany({
            where: {
                councilId: homeID.id, // still need to refer to the object wrapper
            },
                        select:{
                          
                            binType:true,collectDate:true,councilId:true,dayName:true,frequency:true,id:true,
                            BinType : true,specialCollectNote:true
                        }
        });
    
       return NextResponse.json(binDayData);
    
      }
    catch(error)
    { 
        console.log(error);
        return NextResponse.json(error);
    }
}
}