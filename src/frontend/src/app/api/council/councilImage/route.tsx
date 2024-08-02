import prisma from '../../../../utils/prisma';
import { NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';
import {sanitizeInput} from '../../../../components/Sanitiser';
import { supabase } from "../../../../utils/supabaseClient";

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
            councilImage:true
        }
    })
    if (homeID == null) {
        return NextResponse.json({ "error": "requesting bins do not have a valid council (not found)" })
    }
    else {
        try{
            if(homeID && homeID?.councilImage){
        const imageData = supabase.storage.from("council_image").getPublicUrl(homeID.councilImage);
        if(imageData){
            let _url = imageData?.data?.publicUrl;
            if(_url)
            { 
                return NextResponse.json(_url);

            }
        }else{
            console.log("image data empty")
            return NextResponse.json({ "error": "requesting council image not found!! " })
        }}else{
            console.log("council data empty")
            return NextResponse.json({ "error": "requesting council not found!! " })
        }
    } catch (error) {
        console.log("Exception occurd : "+error)
        return NextResponse.json("Exception : "+error);
    }
}
}

