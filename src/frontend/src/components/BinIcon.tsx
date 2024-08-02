import React, { useState, useEffect } from "react";
import { useCouncilContext } from "../providers";
import BinExpander from "./BinExpander";

// Component that used to show the bin's type and its image:
interface IconProps {
  iconType: string;
  can: string;
  cannot: string;
  explorebin: string | null;
}

const BinIcon: React.FC<IconProps> = ({
  iconType,
  can,
  cannot,
  explorebin,
}) => {
  // Setting up an state for managing the opening and close of the bins detail:
  const [openRules, setOpenRules] = useState(false);
  const toggleOpenRules = () => {
    setOpenRules(!openRules);
  };

  function loadImageFromDB(imageType : string){
    fetch(`/api/bins/images?type=${imageType}`
    )
      .then((res) => res.json())
      .then((data) => {
        
        if(!data.error){
              setImagePath(data) ;
          }})
      .catch((error) => {
        alert("failed to fetch bin image");
        setImagePath("undefined") ;
        
        console.log(error);
      });
        
  }



  // determine the image source needed & initialise the state of opnening given explore situations
  const [imagePath, setImagePath] = useState<string>(""); // State to hold the image path
  const homeCouncil = useCouncilContext();
  useEffect(() => {
    // setting the expnder being opened or not:
    if (explorebin && explorebin === iconType) {
      setOpenRules(!openRules);
    }

    


    // Added New bins
    switch (iconType) {
      case "General-waste-bin":
         loadImageFromDB("GeneralWasteBin")
        break;
      case "Recycling-bin":
        loadImageFromDB("RecyclingWasteBin");
        break;
      case "Green-waste-bin":
        loadImageFromDB("GreenWasteBin");
        break;
      case "Food-waste-bin":
        loadImageFromDB("CompostWasteBin");
        break;
      case "Glass-bin":
        loadImageFromDB("GlassWasteBin");
        break;
      case "Electrical-waste-bin":
        loadImageFromDB("ElectricalWasteBin");
        break;
      case "Hard-rubbish/waste":
        loadImageFromDB("HardWasteBin");
        break;
      case "Cardboard-bin":
        loadImageFromDB("CardboardWasteBin");
        break;
      case "FOGO-bin":
        loadImageFromDB("CompostWasteBin");
        break;
      case "Food-and-green-waste-bin":
        loadImageFromDB("CompostWasteBin");
        break;
    }

    if (homeCouncil.councilValue) {
      // Create paths for both general and specialized images
      // env variables updated in vercel frontend
      // const generalImagePath = binImage; // `/images/bins/general-${image}`;
      // const specializedImagePath = binImage;
      //"https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/CardboardWasteBin";
      
      // homeCouncil.councilValue
      //   ? `/images/bins/${homeCouncil.councilValue
      //       .split(",")[0]
      //       .trim()}-${image}`
      //   : "";

      // Try loading the specialized image, if it fails, use the general image
      // const img = new Image();
      // img.src = specializedImagePath;
      // img.onload = () => {
      //   setImagePath(specializedImagePath);
      // };
      // img.onerror = () => {
      //   setImagePath(generalImagePath);
      // };
    }
  }, []);

  if (imagePath == "") {
    return <p>Await for council selection...</p>;
  } else {
    return (
      <div
        className="flex flex-col p-4 rounded-lg items-center bin-display"
        onClick={toggleOpenRules}>
        <p className="font-semibold text-[3.2vw] sm:text-[2.5vw] md:text-[2.2vw] lg:text-[1.5vw] xl:text-[1.2vw] whitespace-nowrap">
          {iconType.replaceAll("-", " ")}
        </p>
        <img src={imagePath} style={{ objectFit: "contain", aspectRatio: 1 }}/>
        <BinExpander
          can={can}
          cannot={cannot}
          isOpen={openRules}
          toggler={toggleOpenRules}
        />
      </div>
    );
  }
};

export default BinIcon;