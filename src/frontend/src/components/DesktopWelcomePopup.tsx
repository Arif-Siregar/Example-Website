import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import { useCouncilContext } from "../providers";
import { set } from "animejs";

type Props = {};

const DesktopWelcomePopup = (props: Props) => {
  const [active, setActive] = useState(1);
  const [fisrtTime, setFirstTime] = useState(false);
  const homeCouncil = useCouncilContext();

  // use home council to determine whether this user is a first time user
  useEffect(() => {
    if ((!homeCouncil.councilValue) && !localStorage.getItem('welcomed')) {
      setFirstTime(true);
    }
    else{
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
      {fisrtTime && (
        <section className="fixed z-[1999] w-[100vw] h-[100vh] bg-[#0202028f] flex justify-center items-center ">
          <div className="container relative w-[500px] h-[620px]  bg-white overflow-hidden">
            {active === 1 && (
              <div className="first h-[70%] relative">
                <div className="img relative w-full">
                  <img
                    src="/images/popup/firstBg.png"
                    alt="bg"
                    className="ml-[-3%] mt-[-300px] scale-x-[1.9]  z-10"
                  />
                  <img
                    src="/images/popup/firstPlanet.png"
                    alt="bg"
                    className="z-20 absolute scale-[.6] bottom-[-10%] left-[10%]"
                  />
                  <img
                    src="/images/popup/firstTrees.png"
                    alt="bg"
                    className="z-20 absolute bottom-[33%] left-[12%] scale-[.85] "
                  />
                  <img
                    src="/images/popup/firstCloud.png"
                    alt="bg"
                    className="z-20 absolute bottom-[45%] right-[43%]"
                  />
                  <img
                    src="/images/popup/firstBirds.png"
                    alt="bg"
                    className="z-20 absolute bottom-[43%] right-[13%]"
                  />
                </div>
              </div>
            )}
            {active === 2 && (
              <div className="first h-[70%] relative">
                <div
                  className="img relative w-full 
       "
                >
                  <img
                    src="/images/popup/secondBg.png"
                    alt="bg"
                    className="ml-[-3%] mt-[-300px] scale-x-[1.2]  z-10"
                  />
                  <img
                    src="/images/popup/secondImage.png"
                    alt="bg"
                    className="z-20 absolute scale-[.7] bottom-[0%] left-[6%]"
                  />
                </div>
              </div>
            )}
            {active === 3 && (
              <div className="first h-[70%] mb-[94%]">
                <div
                  className="img relative w-full h-[65%] 
      "
                >
                  <img
                    src="/images/Splashscreen3.png"
                    alt="bg"
                    className="z-10 mt-[10%] ml-2"
                  />
                  {/* <div className="text flex absolute bottom-[-130%]   px-[15px]">
                    <img
                      src="/images/popup/thirdLogo.png"
                      alt="logo"
                      className="-mr-4 scale-[.2] -translate-x-[30%] -translate-y-[30%]"
                    />
                    <div className="text-[#4D954D] poppins ">
                      <h2
                        className=" text-[25px]  poppins tracking-[.01em] ml-[-220%] mt-[38%] text-black "
                        style={{ fontWeight: "bold" }}
                      >
                        binfluence
                      </h2>

                      <p className="ml-[-220%] w-[200%] text-black ">
                        Helping you reduce waste through making recycling easier
                      </p>
                    </div>
                    <img
                      src="/images/popup/thirdPins.png"
                      alt="bg"
                      className="z-20 absolute bottom-[28%] right-[3vw] scale-[.9]"
                    />
                  </div> */}
                </div>
              </div>
            )}

            <div
              className={`flex justify-center ${
                active === 3 ? " -mt-[110%]" : "  mt-[55%] "
              }`}
            >
              <span
                className="rounded-full w-[12px] h-[12px]"
                style={{ background: active === 1 ? "#4D954D" : "#999999" }}
              ></span>
              <span
                className="rounded-full w-[12px] h-[12px] mx-3"
                style={{ background: active === 2 ? "#4D954D" : "#999999" }}
              ></span>
              <span
                className="rounded-full w-[12px] h-[12px]"
                style={{ background: active === 3 ? "#4D954D" : "#999999" }}
              ></span>
            </div>
            <div className="text" style={{ fontFamily: "Poppins" }}>
              <div className="firstText mt-[2vh]">
                <h2
                  className=" text-[25px] text-center poppins tracking-[.01em] text-[#333]"
                  style={{ fontWeight: "bold", color: "#333" }}
                >
                  {active === 1 && "Welcome to binfluence!"}
                  {active === 2 && "What we do"}
                </h2>
                <p className="text-center text-[#999] w-[376px] mx-auto  text-[18px]  poppins mt-3">
                  {active === 1 &&
                    "A platform designed to provide you with options to divert waste from landfill"}
                  {active === 2 &&
                    "Helping you reduce waste through making information on recycling easier"}
                </p>
              </div>
            </div>
            <div className="btns w-[336px] mt-7 mx-auto flex justify-between items-center absolute bottom-4 left-[17%]">
              <button className="text-[#B4B4B4]" onClick={() => {setFirstTime(false)}}>
                Skip step
              </button>
              <button
                className="bg-[#4D954D] text-white flex justify-center items-center min-w-[102px] h-[46px] rounded px-2"
                onClick={clickHandler}
              >
                {active === 3 ? (
                  <span>Start Recycling</span>
                ) : (
                  <span>Next</span>
                )}

                <img
                  src="/images/popup/btnImage.png"
                  alt="next"
                  className="ml-[6px] pt-[4px]"
                />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default DesktopWelcomePopup;