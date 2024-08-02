"use client";
import React, { useEffect } from "react";
import { useCouncilContext } from "../../providers";
import CouncilMap from "../map/page";
import { useSearchParams } from "next/navigation";
import { sanitizeInput } from "../../components/Sanitiser";



const LoadMap  : React.FC = () => {

    const homeCouncil = useCouncilContext();
    let councilVal:string|null
    const councilValue = sanitizeInput(useSearchParams().get("council"));
    if(councilValue && councilValue!="")
    {
        councilVal=councilValue+","+"dummyvalue"
        homeCouncil.councilUpdate(councilValue+","+"dummyvalue")
    }
    else
    {
        councilVal = homeCouncil.councilValue
    }


    return (
        <div>
            <CouncilMap councilName={councilVal?.toString()} comType={null} height="600px"></CouncilMap>
        </div>
        )
}


export default LoadMap;