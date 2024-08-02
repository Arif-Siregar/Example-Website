"use client";
//Home page to be loaded!
import { useCouncilContext } from "../providers";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import React from "react";
import Card from "../components/Card";
import Script from "next/script";
import Slider from "../components/Slider";
import { useSearchParams } from "next/navigation";
import { sanitizeInput } from "../components/Sanitiser";

const LandingPage: React.FC = () => {
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
  const parentRef = useRef<HTMLImageElement>(null);
  const [parentHeight, setParentHeight] = useState(0);
  useEffect(() => {
    if (parentRef.current) {
      // Setting height of the slider to be right below the image's bottom (still having some rsizing issue)
      const position = parentRef.current.getBoundingClientRect();
      setParentHeight(window.innerHeight - position.bottom);
    }
  }, []);
  // UI and text changes added

  return (
    <div className="flex flex-col">
      {/* <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'GA_MEASUREMENT_ID');
        `}
      </Script> */}

      {/* Introdutive infromation */}
      <Card>
        <div className="flex flex-col items-start">
          <p className="font-semibold mb-1 text-[5vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.2vw] xl:text-[1.7vw]">Welcome to binfluence! </p>
          <p className="text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw]">
          We have created a space to make it easier for you to divert waste from landfill and find options to rehome, repair and recycle your items.
          </p>
        </div>
      </Card>

      <div ref={parentRef}></div>

      {/*Display navigation options*/}
      {councilVal && (
        <div className="flex flex-col items-center w-full mt-6 space-y-2 text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] mb-6">
          <Link
            href="./homerecycling"
            className="flex items-center rounded-full border-2 px-4 py-1 text-white w-[95%] md:w-[85%] lg:w-[60%] font-semibold home-navi-button">
            <span className="flex-grow text-center">
              My bins and item search
            </span>
            <span>➤</span>
          </Link>

          <Link
            href="./scan"
            className="flex items-center rounded-full border-2 px-4 py-1 text-white w-[95%] md:w-[85%] lg:w-[60%] font-semibold home-navi-button">
            <span className="flex-grow text-center">Scan bin QR code</span>
            <span>➤</span>
          </Link>

          <Link
            href="./mapp"
            className="flex items-center rounded-full border-2 px-4 py-1 text-white w-[95%] md:w-[85%] lg:w-[60%] font-semibold home-navi-button">
            <span className="flex-grow text-center">My local community</span>
            <span>➤</span>
          </Link>
          <button
            onClick={() => {
              homeCouncil.councilUpdate(null);
            }}
            className="flex items-center rounded-full border-2 px-4 py-1 text-white w-[95%] md:w-[85%] lg:w-[60%] font-semibold home-navi-button">
            <span className="flex-grow text-center">Reset my council</span>
            <span className="text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw]"> ↻ </span>
          </button>
        </div>
      )}
      <Slider footerHeight={60} />
    </div>
  );
};

export default LandingPage;