"use client";
//Home page to be loaded!
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import ExploreSlider from "../../components/ExploreSlider";
import {
  SpecificBinsStructure,
  SpecificItemsStructure,
} from "../../components/DataStructure";
import ItemLookUpInterface from "../../components/ItemLookUpInterface";
import BinIcon from "../../components/BinIcon";
import React from "react";
import { useSearchParams } from "next/navigation";
import { sanitizeInput } from '../../components/Sanitiser';

interface displayedItems extends SpecificItemsStructure {
  display: boolean; // whether the filtered list contains this item
}

// This page is used to allow users to explore other councils & display the results of scan page:
const LandingPage: React.FC = () => {
  // Controlling sliding of council selection (intialised as true when user is landing on this page)
  const [slideOutCouncil, setSlideOutCouncil] = useState<boolean>(true);
  const [exploreCouncil, setExploreCouncil] = useState<string | null>(null);
  const [explorebin, setExploreBin] = useState<string | null>(null);

  //account for situations of scan page re-direction
  const councilValue = sanitizeInput(useSearchParams().get("council"));
  const binValue = sanitizeInput(useSearchParams().get("bin"));
  useEffect(() => {
    if (councilValue !== null && councilValue !== "") {
      if (binValue !== null && binValue !== "") {
        setExploreCouncil(councilValue);
        setSlideOutCouncil(false);
        setExploreBin(binValue);
      }
    }
  }, []);

  // Fetching the recycling rules corresponidngly:
  const [binsData, setBinsData] = useState<SpecificBinsStructure[]>([]);
  const [isLoadingBins, setLoadingBins] = useState(true);
  useEffect(() => {
    // initialising based on the current council
    if (exploreCouncil != null) {
      setLoadingBins(true);
      fetch(
        `/api/bins/fetchSpecificBins?specificCouncil=${exploreCouncil
          .split(",")[0]
          .trim()}`
      )
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
    }
  }, [exploreCouncil]); // should re-run everytime the homecouncil selection has changed

  // Extracting items data
  const [itemsData, setItemsData] = useState<displayedItems[]>([]);
  const [isLoadingItems, setLoadingItems] = useState(true);
  useEffect(() => {
    if (exploreCouncil != null) {
      setLoadingItems(true);
      fetch(
        `/api/items/fetchItems?specificCouncil=${exploreCouncil
          .split(",")[0]
          .trim()}`
      )
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
          setItemsData(displayedData);
          setLoadingItems(false);
        })
        .catch((error) => {
          console.log(
            "failed to fetch bins information based on the home council"
          );
        });
    }
  }, [exploreCouncil]);

  return (
    <div className="flex flex-col">
      <ExploreSlider
        isSlideOut={slideOutCouncil}
        setSlideOut={setSlideOutCouncil}
        exploreCouncil={exploreCouncil}
        setExploreCouncil={setExploreCouncil}
      />
      {isLoadingItems || isLoadingBins ? (
        <p className="text-lg">Loading...</p>
      ) : (
        <React.Fragment>
          <ItemLookUpInterface
            itemsData={itemsData}
            setItemsData={setItemsData}
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mt-1">
            {binsData.map((bin: SpecificBinsStructure) => (
              <div key={JSON.stringify(bin)}>
                <BinIcon
                  iconType={bin.type}
                  can={bin.can}
                  cannot={bin.cannot}
                  explorebin={explorebin}
                />
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default LandingPage;
