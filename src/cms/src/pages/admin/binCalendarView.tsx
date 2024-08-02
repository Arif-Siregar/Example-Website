import React, { useEffect, useState } from "react";
import { Calendar, Whisper, Popover, Badge } from "rsuite";
import "rsuite/dist/rsuite.css";

import type {
  ResponseData as CreateResponseData,
  RequestInput as CreateRequestInput,
} from "../api/binMan/create";

// References  : https://rsuitejs.com/components/calendar/#custom-cell-styles

// Note : add model popup, save in a json and iterate

// Bin Calendar updates CSS

//resolved council one day save issue

// bin calendar save and refresh issue

interface binDayData {
  councilId: string;
}

const BinManagerCalendar: React.FC<binDayData> = ({ councilId }) => {
  const [councilBinDayData, setcouncilBinDayData] = useState([
    {
      binType: 0,
      collectDate: "",
      councilId: 0,
      dayName: "",
      frequency: "",
      id: 0,
      specialCollectNote: "",
      BinType: { bintypeId: 0, binType: "" },
    },
  ]);

  const [councilBinTypeData, setcouncilBinTypeData] = useState([
    {
      type: "",
    },
  ]);

  useEffect(() => {
    const binDayData = async () => {
      const response = await fetch(
        `/api/binCollection/?councilId=${councilId}`,
        {
          method: "GET",
        }
      );
      await response.json().then((val) => {
        setcouncilBinDayData(val.binDays);
        setcouncilBinTypeData(val.binTypes);
      });
    };
    binDayData();
  }, [councilId]);

  async function binDayDelete(binDayId: number) {
    if (confirm(`Are you sure you want to delete?`)) {
      try {
        const response = await fetch(`/api/binCollection/binDayDelete/`, {
          method: "DELETE",
          body: JSON.stringify({
            id: binDayId,
          }),
        });
        const data: CreateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to delete");
        } else {
          alert("Delete successful");
          let binDayList = councilBinDayData;
          setcouncilBinDayData(binDayList.filter((v) => v.id !== binDayId));
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete");
      }
    }
  }

  function renderCell(date: Date) {
    const list = getTodoList(date);
    if (list && list.length > 0) {
      const displayList = list.filter((item, index) => index < 2);

      if (list.length) {
        const moreCount = list.length - displayList.length;
        const moreItem = (
          <li>
            <Whisper
              placement="top"
              trigger="click"
              speaker={
                <Popover>
                  {list.map((item, index) =>
                    item.bin.length > 1 ? (
                      <p key={index}>
                        <b>{item.bin}</b> - {item.title} <br></br>
                        {item.note}
                      </p>
                    ) : (
                      <></>
                    )
                  )}
                </Popover>
              }
            >
              <a>{moreCount} more</a>
            </Whisper>
          </li>
        );

        return (
          <div>
            <ul
              className="calendar-todo-list"
              style={{ display: "flex", flexWrap: "wrap", width: "150px" }}
            >
              {displayList.map((item, index: number) =>
                item.bin.length > 1 ? (
                  <li key={index} className="calendar-todo-list-li-width">
                    {item.binTypeId === 1 ? ( // general
                      <div>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={
                            <Popover>
                              <b>{item.title}</b>
                              <br></br>
                              <button onClick={() => binDayDelete(item.id)}>
                                Delete{" "}
                              </button>
                            </Popover>
                          }
                        >
                          <div style={{ backgroundColor: "red" }}>. </div>
                        </Whisper>
                      </div>
                    ) : item.binTypeId === 2 ? ( // recycle
                      <div>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={
                            <Popover>
                              <b>{item.title}</b>
                              <br></br>
                              <button onClick={() => binDayDelete(item.id)}>
                                Delete{" "}
                              </button>
                            </Popover>
                          }
                        >
                          <div style={{ backgroundColor: "yellow" }}>. </div>
                        </Whisper>
                      </div>
                    ) : item.binTypeId === 3 ? ( // green
                      <div>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={
                            <Popover>
                              <b>{item.title}</b>
                              <br></br>
                              <button onClick={() => binDayDelete(item.id)}>
                                Delete{" "}
                              </button>
                            </Popover>
                          }
                        >
                          <div style={{ backgroundColor: "green" }}>. </div>
                        </Whisper>
                      </div>
                    ) : item.binTypeId === 4 ? ( // food
                      <div>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={
                            <Popover>
                              <b>{item.title}</b>
                              <br></br>
                              <button onClick={() => binDayDelete(item.id)}>
                                Delete{" "}
                              </button>
                            </Popover>
                          }
                        >
                          <div style={{ backgroundColor: "green" }}>. </div>
                        </Whisper>
                      </div>
                    ) : item.binTypeId === 5 ? ( // fogo
                      <div>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={
                            <Popover>
                              <b>{item.title}</b>
                              <br></br>
                              <button onClick={() => binDayDelete(item.id)}>
                                Delete{" "}
                              </button>
                            </Popover>
                          }
                        >
                          <div style={{ backgroundColor: "green" }}>. </div>
                        </Whisper>
                      </div>
                    ) : item.binTypeId === 6 ? ( // glass
                      <div>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={
                            <Popover>
                              <b>{item.title}</b>
                              <br></br>
                              <button onClick={() => binDayDelete(item.id)}>
                                Delete{" "}
                              </button>
                            </Popover>
                          }
                        >
                          <div style={{ backgroundColor: "purple" }}>. </div>
                        </Whisper>
                      </div>
                    ) : (
                      <div>
                        <Whisper
                          placement="top"
                          trigger="click"
                          speaker={
                            <Popover>
                              <b>{item.title}</b>
                              <br></br>
                              <button onClick={() => binDayDelete(item.id)}>
                                Delete{" "}
                              </button>
                            </Popover>
                          }
                        >
                          <div style={{ backgroundColor: "orange" }}>.</div>
                        </Whisper>
                      </div>
                    )}
                  </li>
                ) : (
                  <></>
                )
              )}
              {moreCount ? moreItem : null}
            </ul>
          </div>
        );
      }
    }
  }

  function getTodoList(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return getData(day, month, year);
  }

  function getData(day: number, month: number, year: number) {
    let result = [{ id: 0, binTypeId: 0, bin: "", title: "", note: "" }];
    if (councilBinDayData) {
      result.splice(0);
      councilBinDayData.forEach((cd) => {
        if (
          cd.id > 0 &&
          new Date(cd.collectDate).getDate() === day &&
          new Date(cd.collectDate).getMonth() === month &&
          new Date(cd.collectDate).getFullYear() === year
        ) {
          let titleDesc = cd.BinType.binType + " Bin Collect";
          result.push({
            id: cd.id,
            binTypeId: cd.binType,
            bin: cd.BinType.binType,
            title: titleDesc,
            note: cd.specialCollectNote,
          });
        } else {
          return [{ bin: "", title: "" }];
        }
      });
    }

    return result;
  }

  const shortForm = {
    "Special-Collection": "special",
    "General-waste-bin": "general",
    "Green-waste-bin": "green",
    "FOGO-bin": "fogo",
    "Recycling-bin": "recycle",
    "Food-waste-bin": "food",
    "Glass-bin": "glass",
  };

  return (
    <div>
      <ul className="legend">
        {councilBinTypeData.map((type) => (
          <li><span className= {shortForm[type.type]}></span>{type.type}</li>
        ))}
        <li>
          <span className="special"></span> Special-collection
        </li>
      </ul>
      <br></br>
      <Calendar bordered renderCell={renderCell} />;
    </div>
  );
};

export default BinManagerCalendar;