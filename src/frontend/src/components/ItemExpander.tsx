import React, { useEffect, useState } from "react";
import { Method } from "./DataStructure";

interface itemExpanderProps {
  name: string;
  methods: Method[];
}

// Component used to control the displays of each individual item:
const ItemExpander: React.FC<itemExpanderProps> = ({ name, methods }) => {
  // intialise the state that determine the expander structure:
  const [collectionPoints, setCollectionPoints] = useState<Method[]>([]);
  const [dropOffPoints, setDropOffPoints] = useState<Method[]>([]);

  useEffect(() => {
    const cPoints: Method[] = [];
    const dPoints: Method[] = [];

    methods.map((method) => {
      if (method.bin === null) {
        dPoints.push(method);
      } else {
        cPoints.push(method);
      }
    });
    setCollectionPoints(cPoints);
    setDropOffPoints(dPoints);
  }, [methods]);

  // Manage the toggling of this expander:
  const [isOpen, setIsOpen] = useState(false);
  const toggleExapnder = () => {
    setIsOpen(!isOpen);
  };

  // Manage the item images:
  const [imagePath, setImagePath] = useState<string>("");
  useEffect(() => {
    const imageName: string = name.trim().replaceAll("/", "-"); // to account for item names that contains backslash
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
        onClick={toggleExapnder}>
        {}
        <img
          src={imagePath}
          className={`${
            isOpen ? "w-[12vw] sm:w-[10vw] md:w-[8vw] lg:w-[7vw] xl:w-[5vw] rounded-full" : 
            "w-[7vw] sm:w-[5vw] md:w-[4vw] lg:w-[3.5vw] xl:w-[2.8vw] rounded-lg"
          } mr-2`}
        />
        <p
          className={`flex items-center ${
            isOpen
              ? "pickle-green-text text-center font-bold text-[3.9vw] sm:text-[2.8vw] md:text-[2.3vw] lg:text-[1.8vw] xl:text-[1.6vw]"
              : "truncate font-semibold text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"
          }`}>
          {name}
        </p>
      </div>

      {/*show  content when the item is opened*/}
      {isOpen && (
        <React.Fragment>
          {collectionPoints.length ? ( // assuming at least on collection bin note
            <div>
              <ul className="ml-2 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
                <li className="flex flex-row">
                  <span className="checkmark mr-2">✓</span>
                  <p>
                    This goes in your <b>{collectionPoints[0].bin?.type.toString().replaceAll("-"," ")}</b>
                  </p>
                </li>
              </ul>

              <ul className="mt-2 list-disc text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
                {collectionPoints.map((cPoint: Method) => {
                  // Check map for each note of collection bin
                  if (cPoint.note && !cPoint.note.includes("http")) {
                    return (
                      <li className="ml-8 whitespace-normal" key={cPoint.note}>
                        <p>
                          <b>Note: </b>
                          {cPoint.note}
                        </p>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>

              <ul className="list-disc break-all">
                {collectionPoints.map((cPoint: Method) => {
                  // Check map for each link of collection bin
                  // Check if the note is link
                  if (cPoint.note && cPoint.note.includes("http")) {
                    return (
                      <li
                        key={JSON.stringify(cPoint)}
                        className="ml-8 whitespace-normal italic">
                        <div className="flex flex-row">
                          <a
                            className="text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"
                            href={cPoint.note}
                            target="_blank"
                            rel="noopener noreferrer">
                            <u>{cPoint.note}</u>
                          </a>
                          <svg
                            className="w-[2vw] sm:w-[1.8vw] md:w-[1.5vw] lg:w-[1.2vw] xl:w-[1vw] dark:creamy-grey-text"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 18">
                            <path d="M17 0h-5.768a1 1 0 1 0 0 2h3.354L8.4 8.182A1.003 1.003 0 1 0 9.818 9.6L16 3.414v3.354a1 1 0 0 0 2 0V1a1 1 0 0 0-1-1Z" />
                            <path d="m14.258 7.985-3.025 3.025A3 3 0 1 1 6.99 6.768l3.026-3.026A3.01 3.01 0 0 1 8.411 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V9.589a3.011 3.011 0 0 1-1.742-1.604Z" />
                          </svg>
                        </div>
                      </li>
                    );
                  }
                  return null; // Return null when the condition is not met
                })}
              </ul>
            </div>
          ) : (
            // else just remind users they canot recycle this at collection point
            <ul className="ml-2 text-[3.2vw] sm:text-[2.7vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
              <li>
                <span className="crossmark mr-2">x</span>
                You <b>cannot</b> dispose of it in the collection bins, please
                drop-off as follow:
              </li>
            </ul>
          )}

          {Boolean(dropOffPoints.length) && ( // only provide a separator between collection points and drop off points if drop off points exists
            <p className="drop-off-separater font-semibold text-center mt-1 text-[3.2vw] sm:text-[2.7vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
              Available drop-off options
            </p>
          )}

          {/* drop off points if they exists on this item */}
          {Boolean(dropOffPoints.length) && (
            <div className="mt-1 space-y-4 max-h-40 overflow-y-auto rule-scroll">
              {dropOffPoints.map((dpoint) => (
                // Display the name of facility
                <div key={JSON.stringify(dpoint)} className="ml-2 mt-1">
                  <div className="flex flex-row font-semibold items-center text-[2.9vw] sm:text-[2.3vw] md:text-[1.8vw] lg:text-[1.3vw] xl:text-[1.1vw]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-[4vw] sm:w-[2.8vw] md:w-[2vw] lg:w-[1.5vw] xl:w-[1vw] mr-4 flex-shrink-0">
                      <path d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                      <path
                        fill-rule="evenodd"
                        d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {dpoint.method?.split("\nDrop off\n")[0].replace("\n"," ")}
                  </div>

                  <ul className="ml-8 list-disc break-all light-white-text">
                  {dpoint.address && (
                      <li className="text-[2.4vw] sm:text-[2.2vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
                        <b>Location:</b>{" "}
                        {dpoint.address.replace("\n"," ")}
                      </li>
                    )}
                    {dpoint.note && dpoint.note.includes("http") && (
                      <p className="italic">
                        <div className="flex flex-row">
                          <a
                            className="text-[2.4vw] sm:text-[2.2vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"
                            href={dpoint.note}
                            target="_blank"
                            rel="noopener noreferrer">
                            <u>Click here</u>
                            {/* {dpoint.note} */}
                          </a>
                          {/* <svg
                            className="w-[1.7vw] sm:w-[1.5vw] md:w-[1.2vw] lg:w-[1vw] xl:w-[0.8vw] dark:creamy-grey-text"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 18">
                            <path d="M17 0h-5.768a1 1 0 1 0 0 2h3.354L8.4 8.182A1.003 1.003 0 1 0 9.818 9.6L16 3.414v3.354a1 1 0 0 0 2 0V1a1 1 0 0 0-1-1Z" />
                            <path d="m14.258 7.985-3.025 3.025A3 3 0 1 1 6.99 6.768l3.026-3.026A3.01 3.01 0 0 1 8.411 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V9.589a3.011 3.011 0 0 1-1.742-1.604Z" />
                          </svg> */}
                        </div>
                      </p>
                    )}
                    {dpoint.note && !dpoint.note.includes("http") && (
                      <li className="text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
                        <b>Note:</b> {dpoint.note}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default ItemExpander;