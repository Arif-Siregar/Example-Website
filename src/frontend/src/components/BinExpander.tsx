// bin expander that takes the spaces when user clicks that particular bin, showing the

import React, { useEffect, useRef, useState } from "react";
import { useMainContainerRef } from "../providers";
import { Dialog } from "@mui/material";

// the rules of can and can't:
interface ExpanderProps {
  can: string;
  cannot: string;
  isOpen: boolean;
  toggler: () => void;
}

const BinExpander: React.FC<ExpanderProps> = ({ can, cannot, isOpen, toggler }) => {
  console.log(can, cannot, isOpen)
  // Calling to prevent scrollablility to the main container when the bin is expanded
  const MainContainerRef = useMainContainerRef();
  useEffect(() => {
    const currentRef = MainContainerRef.current
    if (currentRef) {
      if (isOpen) {
        currentRef.className = currentRef.className.replace("overflow-y-auto", "overflow-y-hidden")
      }
      else {
        currentRef.className = currentRef.className.replace("overflow-y-hidden", "overflow-y-auto")
      }
    }
  }, [isOpen])

  function useOutsideAlerter(ref:any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event:any) {
        if (ref.current && !ref.current.contains(event.target)) {
          console.log(isOpen)
          handletoggler()
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref,isOpen]);
  }

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useOutsideAlerter(wrapperRef);

  const gobackref = useRef(null)

  // format the can and cannt list before rendering:
  let cannotList: string[] = ["undefined"]
  if (cannot) {
    if (cannot.includes("[") || cannot.includes("]")){
      cannotList = JSON.parse(cannot)
    }
    else{cannotList[0] = cannot}
  }
  let canList: string[] = ["undefined"]
  if (can){
    if (can.includes("[") || can.includes("]")){
      canList = JSON.parse(can)
    }
    else{canList[0] = can}
  }

  const [displayCol, setDisplayCol] = useState("left");
  const displayRight = () => {
    setDisplayCol("right");
  };
  const displayLeft = () => {
    setDisplayCol("left");
  };

  // Prevent clicks on any part of the expander will not propagrate to binIcon (no unexpected closures):
  const handleExpanderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handletoggler = () =>{
    console.log(isOpen)
    toggler()
  }

  // Manage scrolling to the top of the main display container
  //const headRef = useRef<HTMLDivElement | null>(null);
  function scrollToTop() {
    if (wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
  useEffect(() => {
    if (isOpen) {
      scrollToTop();
    }
  }, [isOpen]);

  return (
      <React.Fragment>
      {isOpen && (
        <div 
          className={`absolute flex flex-col rounded-lg border-solid border-4 border-[rgb(var(--pickle-green))] light-white-bg modal-box`}
          style={{top: "20%", width: "60%", height: "60%"}}
          onClick={handleExpanderClick}
          ref={wrapperRef}>
          <div className="sticky top-[-4] z-60 flex flex-row">
            <button
              className={`h-14 w-1/2 rounded-b-lg p-2 font-semibold border-solid border-r-1 whitespace-nowrap text-[4vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[1.8vw] xl:text-[1.2vw]
                            ${displayCol == "left"
                  ? "clickedList pickle-green-text border-b-4"
                  : "unclickedList border-b-2"
                }`}
              onClick={(e) => {
                if (displayCol == "right") {
                  //only clickable when current displaying cannot go in list
                  displayLeft();
                }
              }}>
              What can go in
            </button>

            <button
              className={`h-14 w-1/2 rounded-b-lg p-2 font-semibold border-solid border-l-1 whitespace-nowrap text-[4vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[1.8vw] xl:text-[1.2vw]
                            ${displayCol == "right"
                  ? "clickedList custom-red-text border-b-4"
                  : "unclickedList border-b-2"
                }`}
              onClick={(e) => {
                if (displayCol == "left") {
                  //only clickable when current displaying can go in list
                  displayRight();
                }
              }}>
              What cannot go in
            </button>
          </div>

          {/* display accoridngly */}
          <ul className="flex flex-col items-start overflow-y-auto light-white-bg mb-10 rule-scroll">
            {displayCol === "left"
              ? canList.map((item) =>
                item === "undefined" ? (
                  <li key={item} className="text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] absolute left-[25%] right-[25%] top-[50%] text-center">{`Rules are undefined`}</li>
                ) : (
                  <li
                    key={JSON.stringify(item)}
                    className="py-2 px-4 flex flex-row w-full hover:bg-[rgb(var(--creamy-green))] duration-300 text-[4vw] sm:text-[3.5vw] md:text-[2.3vw] lg:text-[1.5vw]"
                  >
                    <span className="checkmark text-[4vw] sm:text-[3.5vw] md:text-[2.3vw] lg:text-[1.5vw] mr-2 ml-2">✓</span> {item}
                  </li>
                )
              )
              : cannotList.map((item) =>
                item === "undefined" ? (
                  <li key={item} className="text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] absolute left-[25%] right-[25%] top-[50%] text-center">{`Rules are undefined`}</li>
                ) : (
                  <li
                    key={JSON.stringify(item)}
                    className="py-2 px-4 flex flex-row items-center w-full hover:bg-[rgb(var(--custom-red))] hover:text-[rgb(var(--light-white))] duration-300 text-[4vw] sm:text-[3.5vw] md:text-[2.3vw] lg:text-[1.5vw]"
                  >
                    <span className="crossmark text-[4vw] sm:text-[3.5vw] md:text-[2.3vw] lg:text-[1.5vw] mr-2 ml-2">x</span> {item}
                  </li>
                )
              )}
          </ul>


          {/*close button*/}
          <div
            className="absolute bottom-2 right-3 flex justify-end items-center w-[6.5vw] md:h-[4.2vh]"
            onClick={handletoggler}
            >
            <img src="/images/b-button-green.png" className="h-[100%]" />
            <p className="font-semibold text-[3.5vw] sm:text-[2.5vw] md:text-[18px] pickle-green-text whitespace-nowrap">
              go back
            </p>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default BinExpander;