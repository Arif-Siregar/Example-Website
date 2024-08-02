export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';
import {sanitizeInput} from '../../../../components/Sanitiser';
import { supabase } from "../../../../utils/supabaseClient";

// API used to fetch all the bins & its info according to council selected:
// Debug bin image issue
//Council Image Added Front End
export async function GET(req: NextRequest) {
    try{
        //sanitise the parameters:
    
        const queryParams = queryString.parseUrl(req.url).query;

    // first determine the council id associated with that council name:
        const imageType = sanitizeInput(queryParams.type);
        if (!imageType) {
            return NextResponse.json({ "error": "The 'Image Type' parameter is missing or null" });
        }else{
            console.log("image type : "+imageType)
        const imageData = supabase.storage.from("bin_image").getPublicUrl(imageType);
        //console.log(imageData)
        if(imageData){
            let _url = imageData?.data?.publicUrl;
            if(_url)
            { 
                return NextResponse.json(_url);

            }
        }else{
            console.log("image data empty")
            return NextResponse.json({ "error": "requesting bin image not found!! " })
        }
    }

    } catch (error) {
        console.log("Catch error "+ error);
        return NextResponse.json({ "Exception": error});
    }
}


