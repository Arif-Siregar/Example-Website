"use client";
import React, { useState } from "react";
import Card from "../../../components/Card";
import Footer from "../../../components/Footer";

import RecycleTtem from "../../../components/RecycleItem";
import recycleData from "../../../public/councils_data/recycling";
import { useCouncilContext } from "../../../providers";
import CouncilMap from '../../map/page'
import LocationTtem from "../../../components/locationItem";

type Props = {};

const Recycle = (props: Props) => {
  const [data, setData] = useState(recycleData);

  const homeCouncil = useCouncilContext();

  // Setting up the states for search list:
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value.length <= 0) {
      setData(recycleData);
    } else {
      // corresponding set the siltered Items, must create a new object that represents the most-up-to-date filter
      const filtered = data.filter((item: any) =>
        item.product.toLowerCase().includes(value.toLocaleLowerCase())
      );
      setData(filtered);
    }
  };

  // handle search input placeholder, when user clicks to serach, the full list of itemsData slide out:
  const [isClearingPlaceholder, setIsClearingPlaceholder] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const handleSearchClick = () => {
    setIsClearingPlaceholder(true);
    setSlideOut(true);
  };

  return (
    <div>
      {/* <Card>
       
        <h2 className="font-bold mb-2 text-[5vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.2vw] xl:text-[1.7vw]">Local community scheme - Recycle </h2>
        <p className="text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.1vw] flex flex-col item-start">
          <span>Search here to find all the places that you can recycle your items. If
          they are recyclable, we will give you the information! This might be
          through your Council bin, local recycling centre, or local community
          initiatives seeking items for recycling into a new item.</span>
          <span>If you cannot
          find your item and would like us to add it to the app, please send us
          a message through our contact page with the name of the item and your
          Council and we will do our best/magic.</span>
        </p>
      </Card>

      <div className="mt-3 sm:w-[80%] sm:mx-auto md:w-[70%] text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] xl:text-[1.3vw]">
        <input
          type="text"
          placeholder={`${isClearingPlaceholder ? "" : "Search Here ..."}`}
          value={searchValue}
          onClick={handleSearchClick}
          onChange={handleSearchChange}
          className="w-full px-2 py-1 mb-2 search-border-colour "
        />


        <div className="hide-scroll grid grid-cols-1 gap-[0.5rem] mb-4 rounded-lg max-h-[250px] sm:max-h-[300px]  w-[100%] overflow-y-scroll">
          {data.map((item: any, index: number) => {
            return (
              <RecycleTtem
                key={JSON.stringify(item)}
                name={item.name}
                product={item.product}
                location={item.location}
                link={item.link}
                notes={item.notes}
                drop_off={item.drop_off}
                frequecy={false}
                showProduct={false}
              />
            );
          })}


        </div>
      </div>
       */}

      

      <div >

        <hr></hr>
    
       <CouncilMap councilName={homeCouncil?.councilValue?.toString()} comType={"1"} height="400px"></CouncilMap>
           
      </div>
      <br/>
    
    </div>
  );
};

export default Recycle;
