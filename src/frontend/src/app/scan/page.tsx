//@ts-nocheck
"use client";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import Footer from "../../components/Footer";

const Scan = () => {
  const [isScanned, setIsScanned] = useState(false);
  const [indication, setIndication] = useState("");

  function ScanValidation(councilParam: string, binParam: string) {
    // only proceed if valid parameters are passed
    if (councilParam != "" && binParam !== "") {
      setIsScanned(true);
      fetch(
        `/api/validation/validateScan?council=${councilParam}&bin=${binParam}`
      )
        .then((res) => res.json())
        .then((isValidated) => {
          if (isValidated) {
            // if the validation is true, then redirect
            setIndication("Redirecting...");
            window.location.replace(
              `/explore?council=${councilParam}&bin=${binParam}`
            );
          } else {
            // else re-do scanning
            setIsScanned(false);
            setIndication(
              "Invalid Scan, please refer to the QR-code example above!"
            );
          }
        })
        .catch((error) => {
          console.log(
            "failed to fetch bins information based on the home council"
          );
          setIsScanned(false);
          setIndication(
            "Invalid Scan, please refer to the QR-code example above!"
          );
        });
    }
  }

  return (
    <div className="flex flex-col w-full sm:h-[99%] items-center scan-border-colour mt-2 p-4">
      {/* Show minimum content */}
      <div className="flex flex-row items-center justify-between">
        <img src="/images/demo-qr-code.png" className="mr-2 w-[28vw] sm:w-[22vw] md:w-[20vw] lg:w-[16vw] xl:w-[10vw]" />
        <div className="flex flex-col ml-5 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw]">
          <p> Scan a binfluence QR code to check what can or cannot go into your Council bin </p>
          {/* <button
            className="councilSearchButton rounded-lg font-semibold px-2 py-1"
            onClick={() => {
              window.location.replace("/explore");
            }}>
            or explore by yourself <span>➤</span>
          </button> */}
        </div>
      </div>

      {/* Only present scanner when validatio is not in progress */}
      {!isScanned && (
        <QrReader
          onResult={(result: any, error: any) => {
            if (!!result) {
              try {
                const url = new URL(result?.text);
                ScanValidation(
                  url.searchParams.get("council") || "",
                  url.searchParams.get("bin") || ""
                );
              } catch (e) {
                console.info(e);
              }
            }
            if (!!error) {
              console.info(error);
            }
          }}
          constraints={{
            facingMode: { exact: "environment" },
            }}
          className="w-3/4 rounded-lg"
        />
      )}
      <p className={`text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.2vw] font-semibold text-center italitic mt-2`}>
        {indication}
      </p>
    </div>
  );
};

export default Scan;