import React, { useEffect, useState } from "react";

interface locationExpanderProps {
  location: string;
  address: string;
  imageName : string;
  notes: string;
  showlocation: boolean;
}

// Component used to control the displays of each individual item:
const LocationTtem: React.FC<locationExpanderProps> = ({
  location,
  notes,
  imageName,
  address,
  showlocation,
}) => {
  // Manage the toggling of this expander:
  const [isOpen, setIsOpen] = useState(false);
  const toggleExapnder = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div id="resultRow" className="flex flex-col item-display rounded-lg w-full">
      {/*show minimum content when the item is not being opened*/}
      <div
        className={`flex flex-row items-center ${isOpen ? "mb-2" : ""}`}
        // onClick={toggleExapnder}
      >
        <img
          src={`/images/mapPointer/`+imageName}
          className={`${
            isOpen ? "w-[12vw] sm:w-[10vw] md:w-[8vw] lg:w-[7vw] xl:w-[5vw] rounded-full" : 
            "w-[7vw] sm:w-[5vw] md:w-[4vw] lg:w-[3.5vw] xl:w-[2.8vw] rounded-lg"
          } mr-2`}
        />
        <p
          className={`flex items-center max-w-xs ${
            isOpen
              ? "pickle-green-text text-left font-bold text-[3.9vw] sm:text-[2.8vw] md:text-[2.3vw] lg:text-[1.8vw] xl:text-[1.6vw]"
              : "truncate font-semibold text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"
          }`}
        >
          { location}
        </p>
      </div>
    </div>
  );
};

export default LocationTtem;
