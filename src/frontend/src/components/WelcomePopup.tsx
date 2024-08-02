import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import { useCouncilContext } from "../providers";

type Props = {};

// This component is to display the mobile version fot the welcome page to users who don't have a
const WelcomePopup = (props: Props) => {
  const [active, setActive] = useState(1);
  const [fisrtTime, setFirstTime] = useState(false);
  const homeCouncil = useCouncilContext();

  // use home council to determine whether this user is a first time user
  useEffect(() => {
    if ((!homeCouncil.councilValue) && !localStorage.getItem('welcomed')) {
      setFirstTime(true);
    }
    else {
      localStorage.setItem('welcomed', 'done')
    }
  }, []);

  // handdling page jumps between pages
  const clickHandler = () => {
    if (active == 3) {
      setFirstTime(false);
      localStorage.setItem('welcomed', 'done')
    } else {
      setActive(active + 1);
    }
  };

  return (
    <>
      {(fisrtTime) && (
        <section className="absolute left-0 top-0 z-[1999] w-full h-[100vh] bg-white overflow-x-hidden">
          {active === 1 && (
            <div className="img w-full h-[60vh]">
              <img
                src="/images/popup/firstBg.png"
                alt="bg"
                className={`w-full h-full scale-x-[1.0] z-10`}
              />
              <img
                src="/images/popup/firstPlanet.png"
                alt="bg"
                className="absolute top-[20%] left-[11%] z-20 w-[65vw]"
              />
              <img
                src="/images/popup/firstTrees.png"
                alt="bg"
                className="absolute top-[3%] left-[5%] z-20 w-[25vw]"
              />
              <img
                src="/images/popup/firstCloud.png"
                alt="bg"
                className="absolute top-[3%] left-[75%] z-20 w-[17vw]"
              />
              <img
                src="/images/popup/firstBirds.png"
                alt="bg"
                className="absolute top-[12%] left-[72%] z-20 w-[23vw]"
              />
            </div>
          )}
          {active === 2 && (
            <div className="img w-full h-[65vh]">
              <img
                src="/images/popup/secondBg.png"
                alt="bg"
                className="w-full h-full scale-x-[1.0] z-10"
              />
              <img
                src="/images/popup/secondImage.png"
                alt="bg"
                className="z-20 absolute top-[25%] left-[10%] w-[70vw] "
              />
            </div>
          )}
          {active === 3 && (
            <div className="img w-full h-[65vh]">
               <img
                    src="/images/Splashscreen3.png"
                    alt="bg"
                    className="z-10 mt-[20%] h-[80%] scale-x-[1.2] ml-2" 
                />
              {/* <img
                src="/images/popup/thirdBg.png"
                alt="bg"
                className="w-full h-full scale-x-[1.2] z-10"
              />
              <img
                src="/images/popup/thirdLogo.png"
                alt="logo"
                className={`z-20 absolute top-[5%] left-[10%] w-[30vw]`}
              />
              <img
                src="/images/popup/thirdPins.png"
                alt="bg"
                className="absolute top-[40%] left-[20%] w-[70vw] z-20"
              /> */}
            </div>
          )}

          <div className="flex justify-center -translate-y-[15px]  absolute left-[5vw] right-[5vw] bottom-[38vh]">
            <span
              className="rounded-full w-[12px] h-[12px]"
              style={{
                background: active === 1 ? "#4D954D" : "#999999",
              }}></span>
            <span
              className="rounded-full w-[12px] h-[12px] mx-3"
              style={{
                background: active === 2 ? "#4D954D" : "#999999",
              }}></span>
            <span
              className="rounded-full w-[12px] h-[12px]"
              style={{
                background: active === 3 ? "#4D954D" : "#999999",
              }}></span>
          </div>

          <div className="text absolute left-[5vw] right-[5vw] bottom-[25vh]" style={{ fontFamily: "Poppins" }}>
            <div className="firstText">
              <h2
                className=" text-[4.8vw] text-center poppins tracking-[.01em] text-[#333]"
                style={{ fontWeight: "bold", color: "#333" }}>
                {active === 1 && "Welcome to binfluence!"}
                {active === 2 && "What we do"}
              </h2>
              <p className="text-center text-[#999] w-[80vw] mx-auto text-[3.7vw] poppins mt-3">
                {active === 1 &&
                  "A platform designed to provide you with options to divert waste from landfill"}
                {active === 2 &&
                  "Helping you reduce waste through making information on recycling easier"}
              </p>
            </div>
          </div>

          <div className="btns w-[70vw] mt-7 mx-auto flex justify-between items-center absolute left-[5vw] right-[5vw] bottom-[10vh]">
            <button
              className="text-[#B4B4B4] text-[3.7vw]"
              onClick={() => setFirstTime(false)}>
              Skip step
            </button>
            <button
              className="bg-[#4D954D] text-[3.7vw] text-white flex flex-row justify-center space-x-2 items-center w-min h-[5.5vh] min-w-fit rounded px-4"
              onClick={clickHandler}>
              {active === 3 ? <span>Start Recycling</span> : <span>Next</span>}
              <img
                src="/images/popup/btnImage.png"
                alt="next"
                className="w-[4.2vw]"
              />
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default WelcomePopup;