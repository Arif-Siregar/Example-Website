import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';
import queryString from 'query-string';
import { sanitizeInput } from '../../../../components/Sanitiser';

// This APi is used to validate whether a council current on payemnt to display its council logo
export async function GET(req: NextRequest){
    //sanitise the parameters:
    const queryParams = queryString.parseUrl(req.url).query;
    const specificCouncil = sanitizeInput(queryParams.council);
    // only allowable for specific council, not allow anyone sees all council payment situations
    if (!specificCouncil) {
        return NextResponse.json({ "error": "The 'specificCouncil' parameter is missing or null" });
    }

    //fidning the council ID
    const councilID = await prisma.council.findFirst({
        where: {
            name: specificCouncil as string,
        },
        select: {
            id: true,
        }
    })
    if (councilID == null) {
        return NextResponse.json({ "error": "requesting bins do not have a valid council (not found)" })
    }

    try {
        const data = await prisma.council.findFirst({
            where:{
                id: councilID.id,
            },
            select:{
                isLiscencing: true,
            }
        });
        return NextResponse.json(data);
    }
    catch(error){
        console.log('failed to fetch the liscencing situation');
        return NextResponse.json({ error: 'Error occurred while fetching council liscencing situation' });
    }
}
