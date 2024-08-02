"use client";

import React, { useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Radio,
  TextField,
} from "@mui/material";
import { getUserFromDb } from "../../utils/requireAuth";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { UserRole } from "@prisma/client";
import prisma from "../../utils/prisma";
import Layout from "../../components/admin/layout";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import type {
  RequestInput as CreateRequestInput,
  ResponseData as CreateResponseData,
} from "../api/binCollection/create";
import { format } from "date-fns";
import moment from "moment";
import BinManagerCalendar from "./binCalendarView";
import { Margin } from "@mui/icons-material";
import { wrap } from "module";

//added special notes to popup

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await getUserFromDb(ctx);

  if (
    "error" in user ||
    (user.role !== "ADMIN" && user.role !== "SUPERADMIN") ||
    !user.councilId
  ) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const council =
    user.role === "SUPERADMIN"
      ? await prisma.council.findMany({ orderBy: { name: "asc" } })
      : await prisma.council.findMany({
          where: {
            id: user.councilId,
          },
        });

  const bins = await prisma.bin.findMany({
    where: {
      // councilId: user.councilId,
    },
  });

  return {
    props: {
      bins,
      user: user as {
        email: string;
        role: UserRole;
        councilId: number;
      },
      council,
    },
  };
};

export default function BinCalendar({
  bins,
  user,
  council,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [councilId, setcouncilId] = useState(user.councilId);
  const [dayName, setDayName] = useState("");
  const [noEndDate, setNoEndDate] = useState(false);
  const [binTypeId, setBinTypeId] = useState<number | null>(null);
  const [frequency, setFrequency] = useState("Once");
  const [specialCollectionNote, setspecialCollectionNote] = useState<string>();
  const [specialBinCollection, setSpecialBinCollection] = useState("N"); // Y or N
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [binList, setBinList] = useState<typeof bins>(
    bins.filter((m) => m.councilId === councilId)
  );

  const [seed, setSeed] = useState(1);

  // Reference : https://stackoverflow.com/questions/41194368/how-to-get-all-sundays-mondays-tuesdays-between-two-dates
  function getCollectingDates(
    startDate: string | undefined,
    endDate: string | undefined,
    day: number,
    frequency: number
  ) {
    let _startDate = startDate ? startDate : new Date().toDateString();
    var start = moment(startDate),
      end =
        endDate === undefined
          ? new Date(_startDate).setFullYear(
              new Date(_startDate).getFullYear() + 1
            )
          : moment(endDate);

    var result = [];
    var current = start.clone();

    if (frequency === 1) {
      result.push(start);
    } else {
      while (current.day(frequency + day).isBefore(end)) {
        result.push(current.clone());
      }
    }

    return result.map((m) => m.format("MM-DD-yyyy"));
  }

  async function saveBinCollect(
    _councilId: number,
    dayName: string,
    binType: number | null,
    frequency: string,
    startDate: string | undefined,
    endDate: string | undefined,
    collectionMode: string
  ) {
    try {
      let specialCollectNote = "";
      let collectModeNumber = 2; // 2 : normal collection

      if (collectionMode === "Y") {
        collectModeNumber = 1; // 1 : special collection
        specialCollectNote =
          collectionMode === "Y" && specialCollectionNote
            ? specialCollectionNote
            : "";
        if (startDate) {
          dayName = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ][new Date().getDay()];
          setBinTypeId(999);
        }
      } else if (frequency === "Once") {
        dayName = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][new Date().getDay()];
      }

      if (!dayName) {
        alert("Please select bin collecting day");
      } else if (!binTypeId) {
        alert("Please select collecting bin");
      } else if (!frequency) {
        alert("Please select bin collecting frequency");
      } else {
        let dateList: string[] = [];
        let everyNumber =
          frequency === "Once"
            ? 1
            : frequency === "Weekly"
            ? 7
            : frequency === "Every 2nd Week"
            ? 14
            : frequency === "Once a month"
            ? 30
            : 1;
        switch (dayName) {
          case "Sunday":
            dateList = getCollectingDates(startDate, endDate, 0, everyNumber);
            break;
          case "Monday":
            dateList = getCollectingDates(startDate, endDate, 1, everyNumber);
            break;
          case "Tuesday":
            dateList = getCollectingDates(startDate, endDate, 2, everyNumber);
            break;
          case "Wednesday":
            dateList = getCollectingDates(startDate, endDate, 3, everyNumber);
            break;
          case "Thursday":
            dateList = getCollectingDates(startDate, endDate, 4, everyNumber);
            break;
          case "Friday":
            dateList = getCollectingDates(startDate, endDate, 5, everyNumber);
            break;
          case "Saturday":
            dateList = getCollectingDates(startDate, endDate, 6, everyNumber);
            break;
          default:
            break;
        }

        let dayCount = 0;
        let saveCount = 0;
        if (dateList.length > 0) {
          dateList.forEach((d) => {
            ++dayCount;
            let collectionDate = d;

            const response = fetch(`/api/binCollection/create/`, {
              method: "POST",
              body: JSON.stringify({
                councilId: _councilId,
                dayName: dayName,
                binType: binType,
                frequency: frequency,
                collectDate: collectionDate,
                collectMode: collectModeNumber,
                specialCollectNote: specialCollectNote,
              } as CreateRequestInput),
            });
            response
              .then((val) => {
                console.log(val);
                ++saveCount;
              })
              .finally(() => {
                if (saveCount > 0 && saveCount === dayCount) {
                  alert("Saved Successfully !!");
                  setSeed(Math.random());
                }
              });
          });
          console.log(saveCount, dayCount);
        } else {
          alert("No record saved for selected date range ");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to Create bin collection");
    }
  }

  // select on change
  const handleChange = (e: any) => {
    setFrequency(e.target.value);
  };

  const handleRadioChange = (e: any) => {
    if (e.target.value === "Y") {
      setBinTypeId(999);
    }
    setSpecialBinCollection(e.target.value);
  };

  const loadBins = (councilId: number) => {
    setBinList(bins.filter((m) => m.councilId === councilId));
  };

  const clearFields = () => {
    setStartDate(new Date());
    setFrequency("Once");
  };

  return (
    <Layout user={user}>
      <Card className="rounded-md p-5">
        <header className="flex flex-col items-center justify-between">
          <h6 className="text-2xl">Bin Days and Collection </h6>
        </header>
        <hr />
        <br></br>
        <Radio
          checked={specialBinCollection === "Y"}
          onChange={handleRadioChange}
          value="Y"
          name="radio-buttons"
          inputProps={{ "aria-label": "A" }}
        />{" "}
        <span>Special Bin collection</span>
        <Radio
          checked={specialBinCollection === "N"}
          onChange={handleRadioChange}
          value="N"
          name="radio-buttons"
          inputProps={{ "aria-label": "B" }}
        />{" "}
        <span>Normal Bin collection</span>
        <div>
          <br></br>
          <Autocomplete
            fullWidth={true}
            className="w-full max-w-xl"
            options={council}
            placeholder=""
            defaultValue={council.find((type) => type.id === councilId) || null}
            onChange={(_, value) => {
              if (value) {
                setcouncilId(value.id);
                loadBins(value.id);
              }
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} autoFocus={true} label="Select Council" />
            )}
          />
          <br></br>
          {specialBinCollection === "N" ? (
            <Autocomplete
              fullWidth={true}
              className="w-full max-w-xl"
              options={binList}
              placeholder=""
              defaultValue={null}
              onChange={(_, value) => {
                if (value) {
                  setBinTypeId(value.bintypeId);
                }
              }}
              getOptionLabel={(option) => option.type}
              renderInput={(params) => (
                <TextField {...params} autoFocus={true} label="Select Bin" />
              )}
            />
          ) : (
            <h3 style={{ marginLeft: "5px" }}>Bin : Special Collection </h3>
          )}
        </div>
        <br></br>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div className="box">
            <select onChange={handleChange} value={frequency}>
              <option key={"Once"}>Once</option>
              <option key={"Weekly"}>Weekly</option>
              <option key={"WeekAfter"}>Every 2nd Week</option>
              <option key={"Monthly"}>Once a month</option>
            </select>
          </div>
          <div className="box">
            {frequency != "Once" ? <span>From : </span> : <span>Date : </span>}
            <DatePicker
              selected={startDate}
              dateFormat={"dd/MM/yyyy"}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          {frequency != "Once" ? (
            <div className="box">
              <div>
                {!noEndDate ? (
                  <div>
                    <span>To : </span>
                    <DatePicker
                      selected={endDate}
                      dateFormat={"dd/MM/yyyy"}
                      onChange={(date) => setEndDate(date)}
                    />
                  </div>
                ) : (
                  <span></span>
                )}
              </div>
              <div>
                <span>
                  <input
                    type="checkbox"
                    defaultChecked={noEndDate}
                    onChange={() => setNoEndDate((val) => !val)}
                  ></input>{" "}
                  No end date
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <br></br>
        {specialBinCollection === "N" && frequency != "Once" ? (
          <Autocomplete
            fullWidth={true}
            className="w-full max-w-xl"
            options={weekDays}
            placeholder=""
            defaultValue={null}
            onChange={(_, value) => {
              if (value) {
                setDayName(value);
              }
            }}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} autoFocus={true} label="Select Day" />
            )}
          />
        ) : (
          <></>
        )}
        {specialBinCollection === "Y" ? (
          <div>
            <br></br>
            <TextField
              type="text"
              id="specialCollectNote"
              label="Special collection note(s)"
              multiline
              rows={4}
              style={{ width: "70%" }}
              defaultValue={specialCollectionNote}
              onChange={(val) => {
                if (val) {
                  setspecialCollectionNote(val.target.value);
                }
              }}
            />{" "}
          </div>
        ) : (
          <></>
        )}
        <br></br>
        <br></br>
        <div>
          <Button
            variant="outlined"
            onClick={() =>
              saveBinCollect(
                councilId,
                dayName,
                binTypeId,
                frequency,
                startDate?.toDateString(),
                noEndDate ? undefined : endDate?.toDateString(),
                specialBinCollection
              )
            }
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            style={{ marginLeft: 10 }}
            onClick={clearFields}
          >
            Clear
          </Button>
        </div>
        <br></br>
        <hr></hr>
        <BinManagerCalendar
          key={seed}
          councilId={councilId.toString()}
        ></BinManagerCalendar>
      </Card>
    </Layout>
  );
}
