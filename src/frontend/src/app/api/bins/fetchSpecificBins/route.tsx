import { NextApiRequest } from 'next';
import prisma from '../../../../utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';
import {sanitizeInput} from '../../../../components/Sanitiser';

// API used to fetch all the bins & its info according to council selected:
export async function GET(req: NextRequest) {
    
    //sanitise the parameters:
    const queryParams = queryString.parseUrl(req.url).query;

    // first determine the council id associated with that council name:
    const homeCouncil = sanitizeInput(queryParams.specificCouncil);
    if (!homeCouncil || homeCouncil === "") {
        return NextResponse.json({ "error": "The 'specificCouncil' parameter is missing or null" });
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
    else {
        try{
        const data = await prisma.bin.findMany({
            where: {
                councilId: homeID.id, // still need to refer to the object wrapper
            },
            select: {
                type: true,
                can: true,
                cannot: true,
            },
        });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(error);
    }
}
}

