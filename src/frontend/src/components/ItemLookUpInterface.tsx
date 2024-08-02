"use client";
import { SpecificItemsStructure } from "./DataStructure";
import { useEffect, useState } from "react";
import ItemExpander from "./ItemExpander";
import DOMPurify from "dompurify";
import { useMainContainerRef } from "../providers";

interface displayedItems extends SpecificItemsStructure {
  display: boolean; // whether the filtered list contains this item
}

interface ItemLookUpInterfaceProps {
  itemsData: displayedItems[];
  setItemsData: (data: displayedItems[]) => void;
}

// function used to control the behaviour of the item look up interface:
const ItemLookUpInterface: React.FC<ItemLookUpInterfaceProps> = ({ itemsData, setItemsData }) => {

  // fucntion used to confirm whether the any word has a match starts with the search term
  function checkWordFilteration(itemName: string, searchTerm: string) {
    const specialCharsList = '[!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~\\s]';
    const specialChars = new RegExp(specialCharsList);
    const words = itemName.toLowerCase().split(specialChars)
    return words.some((word: string) => word.startsWith(searchTerm.toLowerCase()));
  }

  // Setting up the states for search list:
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = DOMPurify.sanitize(event.target.value);
    setSearchValue(value);

    // corresponding set the siltered Items, must create a new object that represents the most-up-to-date filter
    const filtered = itemsData.map((item: displayedItems) => ({
      ...item,
      display: checkWordFilteration(item.name, value),
    }));
    setItemsData(filtered);
  };

  // handle search input placeholder, when user clicks to serach, the full list of itemsData slide out:
  const [isClearingPlaceholder, setIsClearingPlaceholder] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const handleSearchClick = () => {
    setIsClearingPlaceholder(true);
    setSlideOut(true);
  };

  // function used to control the reset of closing the interface
  const closeSearchInterface = () => {
    setSlideOut(false);
    setIsClearingPlaceholder(false);
    setSearchValue("")
    const filtered = itemsData.map((item: displayedItems) => ({
      ...item,
      display: true,
    }));
    setItemsData(filtered);
  };

  // Calling to prevent scrollablility to the main container when the look up iterface expands is expanded
  const MainContainerRef = useMainContainerRef();
  useEffect(() => {
    const currentRef = MainContainerRef.current
    if (currentRef) {
      if (slideOut) {
        currentRef.className = currentRef.className.replace("overflow-y-auto", "overflow-y-hidden")
        console.log(`ref: ${MainContainerRef.current?.className}`)
      }
      else {
        currentRef.className = currentRef.className.replace("overflow-y-hidden", "overflow-y-auto")
      }
    }
  }, [slideOut])

  return (
    <div
      className={slideOut
        ? "absolute top-0 left-0 right-0 w-full min-h-full max-h-full flex flex-col items-center rounded-lg border-solid border-4 border-[rgb(var(--navy-black))] light-white-bg"
        : "min-h-min flex flex-col items-center"
      }>
      <div
        className={`absolute flex items-center sticky top-[-3] w-full interface-display p-3 mb-2 ${slideOut ? "rounded-b-lg flex-col text-lg" : "rounded-lg flex-row"
          }`}>
        <h4 className="text-center font-semibold text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.8vw] xl:text-[1.7vw]">
          {`Don't know which bin? Search by items`}
        </h4>
        <input
          type="text"
          placeholder={`${isClearingPlaceholder ? "" : "Search here ..."}`}
          value={slideOut ? searchValue : ""}
          onClick={handleSearchClick}
          onChange={handleSearchChange}
          className={`px-1 py-1 text-[2.8vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] ${slideOut
              ? "black-search-border w-[88%] mt-2"
              : "ml-2 mr-1 grey-search-border w-[50%] flex-grow"
            }`}
        />
      </div>

      {itemsData && slideOut && (
        <div className="hide-scroll grid grid-cols-1 w-11/12 gap-[0.5rem] overflow-y-auto mb-10 rounded-lg">
          {itemsData.map((item: displayedItems, index: number) => {
            if (item.display) {
              return (
                <ItemExpander
                  key={JSON.stringify(item)}
                  name={item.name}
                  methods={item.methods}
                />
              );
            }
          })}
        </div>
      )}
      {slideOut && ( // close Button to go back to the recycling page
        <div
          className="absolute bottom-1 right-3 flex justify-end items-center w-[6.5vw] md:h-[4.2vh]"
          onClick={closeSearchInterface}>
          <img src="/images/b-button-black.png" className="h-[100%]"/>
          <p className="navy-black-text font-semibold text-[3.5vw] sm:text-[2.5vw] md:text-[18px] back-text whitespace-nowrap">
            go back
          </p>
        </div>
      )}
    </div>
  );
};
export default ItemLookUpInterface;