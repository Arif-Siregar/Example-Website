"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useCouncilContext } from "../providers";
import { councilStructure } from "./DataStructure";
import DOMPurify from "dompurify";
import { NotificationContext } from "../providers";

interface SliderProps {
  footerHeight: number;
}

// Functional component used to produce the sliding animation of home council
function Slider({ footerHeight }: SliderProps) {
  // Constant extract the current councilContext:
  const homeCouncil = useCouncilContext();
  const NotificationContexts:any =  useContext(NotificationContext)
  const [isOpen, setIsOpen] = useState(homeCouncil.councilValue === null); // used to control the toggle of the menu) everytime the council value is changed
  useEffect(() => {
    if (homeCouncil.councilValue === null) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [homeCouncil.councilValue]);

  // function to toggle the slider as needed, and result council filterations as needed
  const handleToggleMenu = (): void => {
    setIsOpen(!isOpen);
    setIsClearingPlaceholder(false);
    setSearchValue("");
    setFilteredCouncils(formattedCouncils);
  };

  // function to toggle when user chose a council value (prefered as a mouseEvent handler to handle on targe of li)
  const handleSelection =
    (appearanceValue: string): React.MouseEventHandler<HTMLLIElement> =>
    () => {
     // alert(appearanceValue);
      homeCouncil.councilUpdate(appearanceValue);
    };

  // Fetching the available councils wrt to each council region and postcodes
  const [isLoading, setIsLoading] = useState(true);
  const [formattedCouncils, setFormattedCouncils] = useState<string[]>([]);
  const [filteredCouncils, setFilteredCouncils] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/council/fetchCouncil")
      .then((res) => res.json())
      .then((data) => {
        // intiialise all the councils in the predefined format (i.e., array of strings)
        const formattedData = data.map((councilRecord: councilStructure) => {
          return `${councilRecord.council.name}, ${councilRecord.name}, ${councilRecord.postcode}`;
        });
        setFormattedCouncils(formattedData);
        setFilteredCouncils(formattedData);
        setIsLoading(false);
      })
      .catch((error) => {
        throw error(error);
      });
  }, []);

  // fucntion used to confirm whether the any word has a match starts with the search term
  function checkWordFilteration(appearanceValue: string, searchTerm: string) {
    const specialCharsList = "[!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~]";
    const specialChars = new RegExp(specialCharsList);
    const words = appearanceValue.toLowerCase().split(specialChars);
    return words.some((word: string) =>
      word.includes(searchTerm.toLowerCase())
    );
  }

  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    // Update the search value
    const value = DOMPurify.sanitize(event.target.value);
    setSearchValue(value);

    // remove special characters:
    const specialCharsList = "[!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~\\s]";
    const specialChars = new RegExp(specialCharsList);

    // Correspondingly update the filtered councils:
    const filtered = formattedCouncils.filter(
      (appearanceValue: string) =>
        checkWordFilteration(appearanceValue, value)
    );
    setFilteredCouncils(filtered);
  };

  const [sliderHeight, setSliderHeight] = useState(0);
  useEffect(() => {
    const heightPx = Number(window.innerHeight * 0.23).toFixed(0);
    //const fixedList = [11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96];
    //const highestNumber: number | undefined = fixedList.reverse().find(num => num * 4 <= parseInt(heightPx))
    if (parseInt(heightPx) > 0) {
      setSliderHeight(parseInt(heightPx));
    }
  }, [window.innerHeight]);

  useEffect(()=>{
    console.log(NotificationContexts.notificationstatus)
    if(NotificationContexts.notificationstatus!=null && !NotificationContexts.notificationstatus){
      const heightPx = Number(window.innerHeight * 0.3).toFixed(0);
      if (parseInt(heightPx) > 0) {
        setSliderHeight(parseInt(heightPx));
      }
    }
  },[NotificationContexts.notificationstatus,sliderHeight])

  // handling of placeholder manipulations
  const [isClearingPlaceholder, setIsClearingPlaceholder] = useState(false);
  const handleSearchClick = () => {
    setIsClearingPlaceholder(true);
  };

  //Handle window size-adpativity:
  const minRef = useRef<HTMLDivElement>(null);
  const [closedHeight, setClosedHeight] = useState("5%");
  useEffect(() => {
    if (minRef.current) {
      const style = window.getComputedStyle(minRef.current);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);
      const minimumHeight =
        minRef.current.clientHeight
        // + marginTop + marginBottom;
      setClosedHeight(`${minimumHeight}px`);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: isOpen ? `${window.innerHeight / 2.5 - 70}px` : `${closedHeight}`, bottom: 60,
      }}
      className={`fixed slider-menu left-0 w-full rounded-lg z-1000 flex flex-col mt-[15%]`}
      onClick={handleToggleMenu}>
      <div className="flex flex-row items-center my-2" ref={minRef}>
        
        {/* specify the button for toggling*/}
        <button className="order-last pr-4">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="20"
              fill="rgb(var(--navy-grey))"
              className="-mt-1 w-[5.2vw] max-w-[70px]"
            >
              <path d="m12 17.586-7.293-7.293-1.414 1.414L12 20.414l8.707-8.707-1.414-1.414L12 17.586z" />
              <path d="m20.707 5.707-1.414-1.414L12 11.586 4.707 4.293 3.293 5.707 12 14.414l8.707-8.707z" />
            </svg>
          ) : (
            <svg
              className={`w-[4.6vw] max-w-[40px] ${homeCouncil.councilValue ? "" : "animate-bounce-horizontal"
                }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          )}
        </button>

        {/* specify the home selection title */}
        <h4
          className={`pl-6 text-center w-full font-bold ${isOpen ? "text-[4.5vw] sm:text-[3.5vw] md:text-[28px]" : "text-[3.2vw] sm:text-[2.8vw] md:text-[25px]"
            }`}
        >
          Search for my Council
        </h4>
      </div>

      {/* Defining the search interface */}

      {isOpen && !isLoading && (
        <div
          className="flex flex-col items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <div className="relative w-4/5 sm:w-[60%]">
            {/* Input box*/}
            <input
              type="text"
              placeholder={`${isClearingPlaceholder ? "" : "Search here ..."}`}
              value={searchValue}
              onClick={handleSearchClick}
              onChange={handleSearchChange}
              className="w-full px-2 py-1 mb-2 search-border-colour text-[3.2vw] sm:text-[2.2vw] md:text-[18px]"
            />

            {/* search tips */}
            <div className="mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[2.8vw] sm:w-[30px] mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-[3.2vw] sm:text-[2vw] md:text-[16px]">
                Search by{" "}
                <span className="pickle-green-text font-semibold">Council name</span>,{" "}
                <span className="pickle-green-text font-semibold">postcode</span>,{" "}
                <span className="pickle-green-text font-semibold">suburb</span> or{" "}
                <span className="pickle-green-text font-semibold">apartment building</span>
              </p>
            </div>

            {/* search results */}
            <ul
              className={`rounded-b-lg border-[rgb(var(--pickle-green))] border-r-2 border-b-2 border-l-2 overflow-y-auto light-white-bg text-[2vh]`}
              style={{ height: `${sliderHeight}px`, marginBottom: "40px" }}
            >
              {filteredCouncils.map((appearanceValue) =>
                isClearingPlaceholder && searchValue.length > 0 ? ( // only displaying when user starts searching
                  <li
                    key={appearanceValue}
                    onClick={handleSelection(appearanceValue)}
                    className="py-2 px-4 cursor-pointer hover:bg-[rgb(var(--creamy-green))] duration-300"
                  >
                    <span>
                      <b>{appearanceValue.split(",")[0].trim()}, </b> 
                      {appearanceValue.split(",")[1].trim()}, {appearanceValue.split(",")[2].trim()}
                    </span>
                  </li>
                ) : null
              )}
            </ul>

          </div>
        </div>
      )}
    </div>
  );
}

export default Slider;