"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, Whisper, Popover } from 'rsuite';
import "rsuite/dist/rsuite.css";
import { useCouncilContext } from '../../providers';
import { useSearchParams } from 'next/navigation';
import { sanitizeInput } from '../../components/Sanitiser';

//Special collection note and legend added

 export default function BinManagerCalendar ()
 {

  const homeCouncil = useCouncilContext();
  let councilVal:string|null
  const councilValue = sanitizeInput(useSearchParams().get("council"));
  if(councilValue && councilValue!="")
  {
    councilVal=councilValue+","+"dummyvalue"
    homeCouncil.councilUpdate(councilValue+","+"dummyvalue")
  }
  else
  {
    councilVal = homeCouncil.councilValue
  }
  
  const [councilBinDayData, setcouncilBinDayData] = useState([{binType:0,collectDate:"",councilId:0,
    dayName:"",frequency:"",id:0,specialCollectNote:"",BinType:{bintypeId : 0,binType:""}}]);

    const isMobile = window.innerWidth <= 768;

useEffect(()=>{
    
if(councilVal != undefined && councilVal!=""){
 let councilId =  councilVal.toString().split(",").length > 0 ? councilVal.toString().split(",")[0] : "";
 fetch(`api/councillic/fetchcouncillic?specificCouncil=${councilId}`).then((res)=>res.json()).then((data)=>{
  if(data.showBinDayCalendar){
      const binDayData= async () =>{
          const response = await fetch(`/api/binCollection?councilId=${councilId}`,{
                method:"GET"
              })
          await response.json().then((val)=>{
            setcouncilBinDayData(val);
              });
            }
            binDayData()
      
  }else{
      alert("You don't have enough permission to view this page");
      history.go(-1);
  }})
    }
},[councilVal])


  function renderCell(date : Date) {

    const list = getTodoList(date);
    if(list && list.length > 0){
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
                {list.map((item, index) => (
                  (item.bin.length > 1) ? 
                  <p key={index}>
                    <b>{item.bin}</b> - {item.title}
                  </p>
                  : <></>
                ))}
              </Popover>
            }
          > 
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );
          
      return (<div>
        <ul className="calendar-todo-list" style={{display: "flex",flexWrap:"wrap",width:"150px"}}>
          {displayList.map((item, index : number) => (
            (item.bin.length > 1) ? 
             !isMobile ? (
              <li  key={index} className='calendar-todo-list-li-3rd'> 
               {item.binTypeId === 1 ? // general
              <div><img src='https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/GeneralWasteBin' /> </div>
              : item.binTypeId === 2 ? // recycle
              <div><img src='https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/RecyclingWasteBin' /> </div>
              : item.binTypeId === 3 ? // green
              <div><img src='https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/GreenWasteBin' />  </div>
              : item.binTypeId === 4 ? // food
              <div><img src='https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/CompostWasteBin' />  </div>
              : item.binTypeId === 5 ? // fogo
              <div><img src='https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/GreenWasteBin' />  </div>
              : item.binTypeId === 6?  // glass
              <div><img src='https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/GlassWasteBin' />  </div>
              :
              <div> 
                
              <Whisper  
              placement="top"
              trigger="click"
              speaker={
                <Popover>
                  <p><b>{item.title}</b><br></br>
                  Note : {item.note}</p>
                </Popover>
              }
            > 
              <img  src='https://mgoqwxgxwuitrtebksfd.supabase.co/storage/v1/object/public/bin_image/GarbageTruck' />  
              
            </Whisper>
            </div>
            }
              </li> 
            )
              :
              (
              <li  key={index} className='calendar-todo-list-li-width'> 
              {item.binTypeId === 1 ? // general
              <div style={{backgroundColor:"red"}}>. </div>
              : item.binTypeId === 2 ? // recycle
              <div style={{backgroundColor:"yellow"}}>. </div>
              : item.binTypeId === 3 ? // green
              <div style={{backgroundColor:"green"}} >.  </div>
              : item.binTypeId === 4 ? // food
              <div style={{backgroundColor:"green"}}>.</div>
              : item.binTypeId === 5 ? // fogo
              <div style={{backgroundColor:"green"}}>. </div>
              : item.binTypeId === 6?  // glass
              <div style={{backgroundColor:"purple"}}>.  </div>
              :
              <div>
                <Whisper  
              placement="top"
              trigger="click"
              speaker={
                <Popover>
                  <p><b>{item.title}</b><br></br>
                  Note : {item.note}</p>
                </Popover>
              }
            > 
             <div style={{backgroundColor:"orange"}}>.</div>
            </Whisper>
              </div>
              
              }
              </li>
            )            
            :<></>
          ))}
          {moreCount ? moreItem : null}
        </ul>
            </div>
      );
          }
    }
  
  }


 function getTodoList(date : Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return getData(day,month,year);
}

function getData(day:number,month : number,year : number){
  let result = [{ binTypeId : 0, bin : '', title: '', note:'' }]
    if(councilBinDayData){
      result.splice(0);
      councilBinDayData.forEach(cd => {
        if(cd.id > 0 && new Date(cd.collectDate).getDate() === day && new Date(cd.collectDate).getMonth() === month && new Date(cd.collectDate).getFullYear() === year) {
            let titleDesc = cd.BinType.binType + " Bin Collect"
            if(cd.specialCollectNote){
              titleDesc = cd.BinType.binType ;
              
            }
          result.push({binTypeId: cd.binType, bin : cd.BinType.binType, title: titleDesc ,note : cd.specialCollectNote}); 
        }else{
          return [{ bin : '', title: '' }];
        } 
      });
    }

    return result;

}

    return <div style={{height:"100px"}}>
        <h3 className='h3FontSize'>Bin day and collection</h3><br></br>
        {isMobile && (
        <ul className="legend">
            <li><span className="general"></span> General bin</li>
            <li><span className="food"></span> Food bin</li>
            <li><span className="fogo"></span> Food and Green</li>
            <li><span className="glass"></span> Glass bin</li>
            <li><span className="recycle"></span> Recycle bin</li>
            <li><span className="glass"></span> Glass bin</li>
            <li><span className="special"></span> Special collection</li>
        </ul>
        )}
        <br></br>
        <Calendar bordered renderCell={renderCell} />
        </div>;
  

};


