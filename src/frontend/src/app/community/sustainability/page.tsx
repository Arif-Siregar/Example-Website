"use client";
import React, { useState } from "react";
import Card from "../../../components/Card";
import Footer from "../../../components/Footer";

import RecycleTtem from "../../../components/RecycleItem";
import susData from "../../../public/councils_data/sustainable";

type Props = {};

const Sustainability = (props: Props) => {
  const [data, setData] = useState(susData);

  // Setting up the states for search list:
  const [searchValue, setSearchValue] = useState("");
  const useHandleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    // corresponding set the siltered Items, must create a new object that represents the most-up-to-date filter

    if (value.length <= 0) {
      setData(susData);
    } else {
      // corresponding set the siltered Items, must create a new object that represents the most-up-to-date filter
      const filtered = data.filter((item: any) =>
        item.name.toLowerCase().includes(value.toLocaleLowerCase())
      );
      setData(filtered);
    }
  };

  // handle search input placeholder, when user clicks to serach, the full list of itemsData slide out:
  const [isClearingPlaceholder, setIsClearingPlaceholder] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const useHandleSearchClick = () => {
    setIsClearingPlaceholder(true);
    setSlideOut(true);
  };

  return (
    <div>
      <Card>
        {/* <p> Here are our benefits to the selected council:</p> */}
        <h2 className="font-bold mb-2 text-[5vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.2vw] xl:text-[1.7vw]">
          Local community scheme – sustainability initiatives{" "}
        </h2>
        <p className="text-[3vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.1vw]">Search here to find all sustainability initiatives in your area.</p>
      </Card>

      <div className="mt-3 sm:w-[80%] sm:mx-auto lg:w-[70%] text-[4vw] sm:text-[3vw] md:text-[2.5vw] lg:text-[2vw] xl:text-[1.3vw]">
        <input
          type="text"
          placeholder={`${isClearingPlaceholder ? "" : "Search Here ..."}`}
          value={searchValue}
          onClick={useHandleSearchClick}
          onChange={useHandleSearchChange}
          className="w-full px-2 py-1 mb-2 search-border-colour "
        />

        {/* {isLoadingItems && <p className="text-center">Loading...</p>} */}

        <div className="hide-scroll grid grid-cols-1 gap-[0.5rem] mb-4 rounded-lg max-h-[270px] sm:max-h-[300px]  w-[100%] overflow-y-scroll">
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
                frequecy={item.frequecy}
                showProduct={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
