"use client";
import { useEffect, useState } from "react";
import { councilStructure } from "./DataStructure";
import React from "react";
import { useCouncilContext } from "../providers";

interface exploreSliderProps {
  isSlideOut: boolean;
  setSlideOut: (setting: boolean) => void;
  exploreCouncil: null | string;
  setExploreCouncil: (council: string | null) => void;
}

// this component is used to control the council seleciton for the explore page
const ExploreSlider: React.FC<exploreSliderProps> = ({
  isSlideOut,
  setSlideOut,
  exploreCouncil,
  setExploreCouncil,
}) => {
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

  // setting up the state management for user searches:
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    // Update the search value
    const value = event.target.value;
    setSearchValue(value);

    // Correspondingly update the filtered councils:
    const filtered = formattedCouncils.filter(
      (appearanceValue: string) =>
        appearanceValue.toLowerCase().includes(value.toLowerCase()) // Use 'value' instead of 'appearanceValue'
    );
    setFilteredCouncils(filtered);
  };

  // handling of placeholder manipulations
  const [isClearingPlaceholder, setIsClearingPlaceholder] = useState(false);
  const handleSearchClick = () => {
    setIsClearingPlaceholder(true);
    setExploreCouncil(null);
    setSlideOut(true);
  };
  const handleSelection = (selectedCouncil: string) => {
    setExploreCouncil(selectedCouncil);
    setSlideOut(false);
    setIsClearingPlaceholder(false);
  };

  // Handle action of setting home council:
  const homeCouncil = useCouncilContext();
  function setHomeCouncil() {
    homeCouncil.councilUpdate(exploreCouncil);
    window.location.replace("/");
  }

  return (
    <div
      className={`flex flex-col items-center 
            ${isSlideOut
          ? "absolute top-0 right-0 left-0 w-full min-h-full max-h-full rounded-lg border-solid border-4 border-[rgb(var(--navy-black))] light-white-bg"
          : "min-h-min"
        }`}>
      {/*Minimum content*/}
      <div
        className={`absolute flex flex-col items-center sticky top-[-3] w-full p-3 mb-2 ${isSlideOut ? "rounded-b-lg interface-display z-1000" : "rounded-lg"
          }`}>
        {/*title*/}
        {exploreCouncil && (
          <div className="flex flex-col items-center w-full">
            <p className="whitespace-nowrap text-[4vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.5vw] xl:text-[2.3vw]">
              Exploring council:{" "}
              <b>
                <u>{exploreCouncil.split(",")[0].trim()}</u>
              </b>
            </p>
            <div className="flex flex-row items-center w-full space-x-1 mt-2">
              <button
                className="flex flex-col items-center councilSearchButton rounded-lg px-2 py-3 w-1/2 whitespace-nowrap text-[2.6vw] sm:text-[2vw] md:text-[1.6vw] lg:text-[1.5vw] xl:text-[1.6vw]"
                onClick={() => {
                  window.location.replace("/explore");
                }}>
                <div className="flex flex-row items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-[4.5vw]">
                    <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
                    <path
                      fill-rule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p className="ml-1">Search another council</p>
                </div>
              </button>
              <button
                className="flex flex-col items-center rounded-lg councilSearchButton px-2 py-3 w-1/2 whitespace-nowrap text-[2.6vw] sm:text-[2vw] md:text-[1.6vw] lg:text-[1.5vw] xl:text-[1.6vw]"
                onClick={setHomeCouncil}>
                <div className="flex flex-row items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-[4.5vw]">
                    <path
                      fill-rule="evenodd"
                      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p className="ml-1">Set as my council</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/*inputs*/}
        {isSlideOut && (
          <div className="flex-col items-start w-[88%]">
            <h4 className={`text-center font-semibold text-[3.6vw] sm:text-[3vw] md:text-[2.3vw] lg:text-[2vw] xl:text-[1.5vw]`}>
              Travelling around? Explore recycling for other regions:
            </h4>
            <input
              type="text"
              placeholder={`${isClearingPlaceholder ? "" : "Search here ..."}`}
              value={searchValue}
              onClick={handleSearchClick}
              onChange={handleSearchChange}
              className={`px-1 py-1 mt-2 w-full black-search-border text-[3vw] sm:text-[2.2vw] md:text-[1.7vw] lg:text-[1.2vw] xl:text-[1vw]`}
            />

            {/* search tips */}
            <div className="mt-2 mb-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[5vw] max-w-[25px] mr-1">
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-[3vw] sm:text-[2vw] md:text-[1.6vw] lg:text-[1.3vw] xl:text-[1.2vw]">
                Search by{" "}
                <u className="pickle-green-text font-semibold">Council name</u>,{" "}
                <u className="pickle-green-text font-semibold">postcode</u> or{" "}
                <u className="pickle-green-text font-semibold">suburb</u>
              </p>
            </div>
          </div>
        )}
      </div>

      {isLoading && isSlideOut && (
        <p className="text-lg font-semibold text-center"> Loading ...</p>
      )}
      {!isLoading && isSlideOut && (
        <ul
          className={`rounded-b-lg border-[rgb(var(--pickle-green))] w-4/5 border-r-2 border-b-2 border-l-2 overflow-y-auto light-white-bg mb-8`}>
          {filteredCouncils.map((appearanceValue) => (
            <li
              key={JSON.stringify(appearanceValue)}
              onClick={() => {
                handleSelection(appearanceValue);
              }}
              className="py-2 px-4 cursor-pointer hover:bg-[rgb(var(--creamy-green))] duration-300 text-[1.5vh]">
              <span>
                <b>{appearanceValue.split(",")[0].trim()}</b>,
                {appearanceValue.split(",")[1].trim()},{" "}
                {appearanceValue.split(",")[2].trim()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExploreSlider;