"use client";
import Footer from "../../components/Footer";
import {
  SpecificBinsStructure,
  SpecificItemsStructure,
} from "../../components/DataStructure";
import { useEffect, useState } from "react";
import { useCouncilContext } from "../../providers";
import BinIcon from "../../components/BinIcon";
import React from "react";
import ItemLookUpInterface from "../../components/ItemLookUpInterface";
import { error } from "console";
import { data } from "autoprefixer";
import { useSearchParams } from "next/navigation";
import { sanitizeInput } from "../../components/Sanitiser";

interface displayedItems extends SpecificItemsStructure {
  display: boolean; // whether the filtered list contains this item
}


// Page for displaying the fetched recycling info wrt to homecouncil
function HomeRecycle() {
  // referencing the current homecouncil context
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
  // Extracting bins data
  const [binsData, setBinsData] = useState<SpecificBinsStructure[]>([]);
  const [isLoadingBins, setLoadingBins] = useState(true);
  useEffect(() => {
    // initialising based on the current
    if (councilVal != null) {
      const paramValue = councilVal.split(",")[0].trim();
      fetch(`/api/bins/fetchSpecificBins?specificCouncil=${paramValue}`)
        .then((res) => res.json())
        .then((data) => {
          setBinsData(data);
          setLoadingBins(false);
        })
        .catch((error) => {
          console.log(
            "failed to fetch bins information based on the home council"
          );
        });
    } else {
      console.log(
        "no longer preparing bins info given no homecouncil has been selected."
      );
    }
  }, [councilVal]); // should re-run everytime the homecouncil selection has changed

  // Extracting items data
  const [itemsData, setItemsData] = useState<displayedItems[]>([]);
  const [isLoadingItems, setLoadingItems] = useState(true);
  useEffect(() => {
    if (councilVal != null) {
      const paramValue = councilVal.split(",")[0].trim();
      fetch(`api/councillic/fetchcouncillic?specificCouncil=${paramValue}`).then((res)=>res.json()).then((data)=>{
        if(data.isLiscencing){
          fetch(`/api/items/fetchItems?specificCouncil=${paramValue}`)
        .then((res) => res.json())
        .then((data) => {
          // Initialize the display property to be true for all items
          const displayedData: displayedItems[] = data.map(
            (item: SpecificItemsStructure) => ({
              name: item.name,
              methods: item.methods,
              display: true,
            })
          );
          debugger;
          setItemsData(displayedData);
          setLoadingItems(false);
        })
        .catch((error) => {
          console.log(
            "failed to fetch bins information based on the home council"
          );
        });
        }
        else{
          setLoadingItems(false)
        }
      }).catch((error)=>{
        console.log("some error")
      })
      // fetch(`/api/items/fetchItems?specificCouncil=${paramValue}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     // Initialize the display property to be true for all items
      //     const displayedData: displayedItems[] = data.map(
      //       (item: SpecificItemsStructure) => ({
      //         name: item.name,
      //         methods: item.methods,
      //         display: true,
      //       })
      //     );
      //     setItemsData(displayedData);
      //     setLoadingItems(false);
      //   })
      //   .catch((error) => {
      //     console.log(
      //       "failed to fetch bins information based on the home council"
      //     );
      //   });
      
    }
  }, [councilVal]);

  if (isLoadingBins || isLoadingItems) {
    return (
      <div className="flex flex-row item-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="">
      <ItemLookUpInterface itemsData={itemsData} setItemsData={setItemsData} />
      <p className="whitespace-nowrap pt-4 pb-4 text-center font-semibold text-[3.5vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[1.8vw] xl:text-[1.5vw]">
        Click on bin image to see what can/cannot go in each bin
      </p>
      {binsData && (
        // giving a layout of 2x3 at most to equally divide the spaces
        <div className="flex gap-4 lg:grid-cols-3" style={{cursor:"pointer"}}>
          {binsData.map((bin: SpecificBinsStructure, index: number) => (
            <div key={index} style={{cursor:"pointer"}}>
              <BinIcon 
                iconType={bin.type}
                can={bin.can}
                cannot={bin.cannot}
                explorebin={null}
              />
            </div>
          ))}
        </div>
      )}
    </div>
    
  );
}
export default HomeRecycle;