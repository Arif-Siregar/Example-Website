import React, { useEffect, useState } from "react";
import { Method } from "./DataStructure";

interface itemExpanderProps {
  product: string;
  name: string;
  link: string;
  location: string;
  drop_off: string;
  notes: string;
  frequecy: any;
  showProduct: boolean;
}

// Component used to control the displays of each individual item:
const RecycleTtem: React.FC<itemExpanderProps> = ({
  product,
  name,
  link,
  location,
  drop_off,
  notes,
  frequecy,
  showProduct,
}) => {
  // Manage the toggling of this expander:
  const [isOpen, setIsOpen] = useState(false);
  const toggleExapnder = () => {
    setIsOpen(!isOpen);
  };

  // Manage the item images:
  const [imagePath, setImagePath] = useState<string>("");
  useEffect(() => {
    const imageName: string = product?.trim().replaceAll("/", "-"); // to account for item names that contains backslash
    const img = new Image();
    img.src = `/images/items/${imageName}.png`;
    img.onload = () => {
      setImagePath(`/images/items/${imageName}.png`);
    };
    img.onerror = () => {
      setImagePath("/images/logo.png");
    };
  }, []);

  return (
    <div className="flex flex-col item-display p-2 rounded-lg">
      {/*show minimum content when the item is not being opened*/}
      <div
        className={`flex flex-row items-center ${isOpen ? "mb-2" : ""}`}
        onClick={toggleExapnder}
      >
        {}
        <img
          src={imagePath}
          className={`${
            isOpen ? "w-[12vw] sm:w-[10vw] md:w-[8vw] lg:w-[7vw] xl:w-[5vw] rounded-full" : 
            "w-[7vw] sm:w-[5vw] md:w-[4vw] lg:w-[3.5vw] xl:w-[2.8vw] rounded-lg"
          } mr-2`}
        />

        <p
          className={`flex items-center max-w-xs ${
            isOpen
              ? "pickle-green-text text-left font-bold text-[3.9vw] sm:text-[2.8vw] md:text-[2.3vw] lg:text-[1.8vw] xl:text-[1.6vw]"
              : "truncate font-semibold text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"
          }`}
        >
          {frequecy ? name : product}
        </p>
      </div>

      {/*show  content when the item is opened*/}
      {isOpen && (
        <React.Fragment>
          <div className="mx-[11%]">
            {!frequecy && (
              <p
                className="my-1 text-center font-bold text-[4.2vw] sm:text-[3vw] md:text-[2.3vw] lg:text-[1.8vw] xl:text-[1.6vw]"
                style={{ color: "#09511c" }}
              >
                {name}
              </p>
            )}

            {showProduct && (
              <p
                className="my-1 text-center font-bold text-[4.2vw] sm:text-[3vw] md:text-[2.3vw] lg:text-[1.8vw] xl:text-[1.6vw]"
                style={{ color: "#09511c" }}
              >
                {product}
              </p>
            )}

            <p className="text-center text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
              {" "}
              <a
                href={link}
                className="underline bold"
                target="_blank"
                style={{ color: "green" }}
              >
                visit website
              </a>{" "}
            </p>

            {location?.length > 0 && (
              <p className="my-1 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
                <span className="font-bold">Location: </span>
                {location}
              </p>
            )}

            <p className="my-1 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">{drop_off}</p>
            {frequecy && frequecy.length > 0 && (
              <p className="my-1 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
                <span className="font-bold">Frequecy:</span> {frequecy}
              </p>
            )}

            {notes.length > 0 && (
              <>
                <span className="text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center font-bold block -mb-[10px]">
                  Notes
                </span>
                <span className="drop-off-separater block mb-2 ml-[8%] text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"></span>
              </>
            )}
            <p className="text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">{notes}</p>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default RecycleTtem;
