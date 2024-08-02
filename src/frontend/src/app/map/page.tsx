"use client"
import React, { useState, useMemo, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api";
import {googleMapsApiKey} from '../../helper/mapHelper'
import LocationTtem from "../../components/locationItem";
import { isatty } from "tty";
import { councilStructure } from "../../components/DataStructure";
import BasicModal from "../../components/locationDescriptionPopup";
import Modal from '@mui/material/Modal';
import { Box } from "@mui/material";

// Reference : https://medium.com/@celisemcclain/google-maps-react-9761ac448070
//for build multiple markers

// https://www.geoapify.com/geocoding-api  ==>  map loading code
// geo location lat. and long.  reference == > https://developers.google.com/maps/documentation/geocoding/requests-geocoding
// Previous reference :  https://dany-rivera.medium.com/how-to-add-google-maps-api-in-next-js-13-step-by-step-c027813d5769
//zoom issue for maps solved
// UI/UX changes in Map


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24
};

//Map Key Updated
interface CouncilProps {
  councilName: string | undefined;
  comType : string|null;  // values are rehome, reuse,repair 
  height : string
}

const CouncilMap : React.FC<CouncilProps> =  ({
  councilName,
  comType,
  height
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey,  
  });

  
  const [communityType, setCommunityType] = useState(comType);
  const [data, setData] = useState(null);
  const [center, setCodinates] = useState(useMemo(() => ({ lat: 0, lng: 0 }), []));
  const [favoritePlaces, setfavoritePlace] = useState([{key:"",name : "",
                                                              notes : "",
                                                              link : "",
                                                              frequency : "",
                                                              location: "",
                                                              communityType: "1",
                                                          codinates : { lat: 0, lng: 0 }}]);

    const [markerPlaces, setMarkerPlace] = useState([{key:"",name : "",
                                                              notes : "",
                                                              link : "",
                                                              frequency : "",
                                                              location: "",
                                                              communityType: "1",
                                                          codinates : { lat: 0, lng: 0 }}]);
  
 const [activeMarker, setActiveMarker] = useState(null);

 const mapDIV = useRef<HTMLDivElement>(null);


 // for search
 const [searchValue, setSearchValue] = useState("");
 const [searchData, setSearchData] = useState(favoritePlaces);

  const [locations, setLocations] = useState([{
              name : "",
              notes : "",
              link : "",
              frequency : "",
              location: "",
              communityType: "1"
            }]); 
            
const [selectedLocation, setSelectedLocation] = useState({
              name : "",
              notes : "",
              link : "",
              frequency : "",
              location: "",
              communityType: "1"
            });  

            
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

useEffect(() => {
              let ignore = false;
              if (!ignore) {
               handleClick()
              }
              return () => { ignore = true; }
              },[]);

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    if (value.length <= 0) {
      setSearchData(favoritePlaces);
    } else {
      // corresponding set the siltered Items, must create a new object that represents the most-up-to-date filter
      const filtered = favoritePlaces.filter((loc: any) =>
        loc.name.toLowerCase().includes(value.toLocaleLowerCase())
        || loc.notes.toLowerCase().includes(value.toLocaleLowerCase())
      );
      setSearchData(filtered);
    }
  };


  

  function handleClick(){
    try {
      
        const xhr = new XMLHttpRequest();
        // NOTE : Move to seperate file
        //https://maps.googleapis.com/maps/api/geocode/json?address='+councilName+'&key=AIzaSyDp4pIM8kCrtmAqSpJcHa9Fm5DgkFnN5WE
      // xhr.open('GET', 'https://api.geoapify.com/v1/geocode/search?text='+councilName+'&apiKey=d945ebb839694d909ddb9d2329abec61');
        
        xhr.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address='+councilName+'&components=country:AU&key='+googleMapsApiKey);
        
        xhr.onload = function() {
          if (xhr.status === 200) {
            let locationData = JSON.parse(xhr.responseText) 
            setData(locationData);
            if(locationData != null){
              setCodinates({ lat: locationData.results[0].geometry.location.lat, lng: locationData.results[0].geometry.location.lng })
              loadCommunityPlaces();
          }}
        };
        xhr.send();
    } catch (error) {
        alert("Error loading cordinates");
    }
  }

  

  function loadCommunityPlaces(){
    setLocations([{
      name : "",
      notes : "",
      link : "",
      frequency : "",
      location: "",
      communityType: "1"
    }]);
    let _councilName = councilName != undefined && councilName?.toString().split(",").length > 0 ? councilName?.toString().split(",")[0] : "";
    fetch(communityType === null? 
      `api/community?selectedCouncil=${_councilName}` : `../api/community?selectedCouncil=${_councilName}`
    )
      .then((res) => res.json())
      .then((data) => {

        if(!data.error){

          locations.shift(); // remove first item

          data.forEach((di:any)  => {
            di.Community_communitytype_mappings.forEach((cm: { communityId: any; communitytypeId: any; })  => {
             
              let com = {
                location: di.location,
                communityType: cm.communitytypeId,
                name : di.name,
                link : di.link,
                frequency : di.frequency,
                notes : di.notes
              }
              locations.push(com);
            });
            
          });
          
       setLocations(locations)
       loadSubLocations();
        
    }})
      .catch((error) => {
        alert("failed to fetch community list")
        console.log(error);
      });
  }


  const handleActiveMarker = (marker :any,selectLocation :any) => {
    if (marker != activeMarker) {
      setActiveMarker(marker);
      handleOpen();
      setSelectedLocation(selectLocation);
      if(mapDIV && mapDIV.current)
        mapDIV.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSelectedMarker = () =>{
    setActiveMarker(null);
    setSelectedLocation({
      name : "",
      notes : "",
      link : "",
      frequency : "",
      location: "",
      communityType: "1"
    });
  }

  

  function loadSubLocations(){

    setfavoritePlace([{key:"",name : "",
                      notes : "",
                      link : "",
                      frequency : "",
                      location: "",
                      communityType: "1",
                  codinates : { lat: 0, lng: 0 }}]);
            
    
   
    let records = communityType != null ? locations.filter((m) => (m.communityType.toString() === communityType)) : locations;
   // let num = 1;
    records.forEach((place) => {
     if(place.location != ""){
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address='+place.location+'&components=country:AU&key='+googleMapsApiKey);
      

        xhr.onload = function() {
        if (xhr.status === 200) {

          let locationData = JSON.parse(xhr.responseText) 
          if(locationData != null && locationData.results.length > 0){
            //let  = [...favoritePlaces];
            let newFavPlace = {key:place.location+"_"+place.communityType.toString(),  
             location: place.location, name : place.name,
             link : place.link,
             notes : place.notes,
             frequency : place.frequency,
             communityType: place.communityType.toString(),
              codinates :{ lat: locationData.results[0].geometry.location.lat, lng: locationData.results[0].geometry.location.lng }}
              // if(favoritePlaces.findIndex(s=>{s.key === newFavPlace.key}) < 0){
                let isAdd : boolean = true;
                favoritePlaces.forEach((pl) => {
                  if(pl.location.includes(newFavPlace.location)){
                    newFavPlace.codinates.lng += 0.00001;
                  }
                  
                  if(pl.key.includes(newFavPlace.key)){
                    isAdd = false;
                  }
                });
                
                if(isAdd){
                  favoritePlaces.push(newFavPlace);
                }

                  setfavoritePlace([...favoritePlaces,newFavPlace]);
                  setMarkerPlace(favoritePlaces);
        }}
      };

      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          
          setfavoritePlace(favoritePlaces);

        }
    }

      xhr.send(null);

    }
    });

  }

  function setComType(type:string){
    setCommunityType(type);

      if(type === ""){
        setfavoritePlace(markerPlaces);
        setSearchData(markerPlaces);

      }else{
        let filData = markerPlaces.filter((p)=>(p.communityType === type));
            setfavoritePlace(filData);
            setSearchData(filData);
      }
      setActiveMarker(null);
      setSelectedLocation({
        name : "",
        notes : "",
        link : "",
        frequency : "",
        location: "",
        communityType: "1"
      });
    
  }
  
  

  return (
     <div >
     {/* <PlaceLookUpInterface  itemsData={[]} setItemsData={set_Locations}> </PlaceLookUpInterface> */}
       
       
      <div className="divcontainer" id="divContainer">
      <div className="main-div">

<div className="sub-container">
              <div className="btn-group " style={{ display: 'flex' }}>
                  <button className={ communityType === null || communityType === "" ?  "selectedColor" : ""} style={{ flex: '1' }}  onClick={()=>setComType("")}>All</button>
                  <button className={ communityType === "1" ?  "selectedColor" : ""}   onClick={()=>setComType("1")} style={{ flex: '1' }}>Recycle</button>
                  <button className={ communityType === "2" ?  "selectedColor" : ""}  onClick={()=>setComType("2")} style={{ flex: '1'}}>Repair</button>
                  <button className={ communityType === "3" ?  "selectedColor" : ""}  onClick={()=>setComType("3")} style={{ flex: '1' }}>Rehome</button>
                </div>
</div>

<div className="sub-container scroll">
              <input
                  type="text"
                  placeholder={"Search here ..."}
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full px-2 py-1 mb-2 search-border-colour "
                />
                <br></br>
                <div>
                {searchData.map((location: any, index: number) => {
                    return (
                     (location.location != "")?
                      <div onClick={() => handleActiveMarker(location.key,location)}>
                          <BasicModal key={location.location}
                            location={ (location.communityType === "1" ? "Recycle" : location.communityType === "2" ? "Repair" : "Rehome") +" - "+location.name }
                            notes={location.notes}
                            link={location.link}
                            frequency={location.frequency}
                            imageName= {location.communityType === "1" ? "map-point-recycle_.png" : location.communityType=== "2" ? "map-point-repair_.png": location.communityType=== "3" ? "map-point-rehome_.png" :"" }
                            address={location.name}
                            showlocation={false}
                          />
                        </div>
                      : <></>
                    );
                  
                  })}
                </div>
</div>

<div className="sub-container">
{selectedLocation.name != "" ? 
       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} id="popupModel">
          
        <div className=" locationBox text-center" style={{ color: "#09511c"  }} >
            
            <p
              className="my-1 text-center font-bold text-[4.2vw] sm:text-[3vw] md:text-[2.3vw] lg:text-[1.8vw] xl:text-[1.6vw]"
              style={{ color: "#09511c" }}
            >
              <span>
           </span> 
              <table>
                <tr>
                  <td>
                           
                  <img
              src={`/images/mapPointer/${selectedLocation.communityType === "1" ? "map-point-recycle_.png" : selectedLocation.communityType=== "2" ? "map-point-repair_.png": selectedLocation.communityType=== "3" ? "map-point-rehome_.png" :""}`}
              className={"w-[12vw] sm:w-[5vw] md:w-[4vw] lg:w-[3.5vw] xl:w-[9.8vw] rounded-lg mr-2"}
            />
                  </td>
                  <td>
               {selectedLocation.name}
                    
                  </td>
                </tr>
              </table>
            </p>
            
          <p className="text-center text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
            {" "}
            <a
              href={selectedLocation.link}
              className="underline bold"
              target="_blank"
              style={{ color: "green" }}
            >
              visit website
            </a>{" "}
          </p>

          <p className="my-1 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center" >
              <span className="font-bold">Location: </span>
              {selectedLocation.location}
          </p>
          

          {selectedLocation.frequency && selectedLocation.frequency?.length > 0 && (
            <p className="my-1 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center" >
              <span className="font-bold">Frequecy:</span> {selectedLocation.frequency}
            </p>
          )}

          {selectedLocation.notes?.length > 0 && (
            <>
              <span className="text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center font-bold block -mb-[10px]">
                Notes
              </span>
              <span className="drop-off-separater block mb-2 ml-[8%] text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"></span>
            </>
          )}
          <p className="text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center">{selectedLocation.notes}</p>
        </div>
         <button className="close-button" onClick={handleClose}>Show on map</button>
        </Box>
      </Modal>
          :<></>  }       
</div>

</div>

<div className="big-div" ref={mapDIV} >
    {data != null && isLoaded  ? (
            <GoogleMap  key={"1"}
              center={center}
              mapContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              zoom={10}
              
            >
              {favoritePlaces.map(c  => ( 
                (c.key != "")?
                (c.communityType === "1") ?
                  <MarkerF key={c.key}  title={c.location} onClick={() => handleActiveMarker(c.key,c)} position={c.codinates} icon={"/images/mapPointer/map-point-recycle_.png"} >
                    {activeMarker && c.key && activeMarker === c.key ? (
                          <InfoWindowF onCloseClick={clearSelectedMarker}>
                            <div>
                              <b>{"Recycle Center"}</b>
                              <br/><b>{c.name}</b>
                              <hr></hr>
                              <br></br>
                              <h5>{c.notes}</h5>
                            </div>
                          </InfoWindowF>
                        ) : null}
                  </MarkerF>
                  : (c.communityType === "2") ?
                  <MarkerF key={c.key}  title={c.location} onClick={() => handleActiveMarker(c.key,c)} position={c.codinates} icon={"/images/mapPointer/map-point-repair_.png"} >
                    {activeMarker && c.key && activeMarker === c.key ? (
                          <InfoWindowF onCloseClick={clearSelectedMarker}>
                            <div>
                              <b>{"Repair Center"}</b>
                              <br/><b>{c.name}</b>
                              <hr></hr>
                              <br></br>
                              <h5>{c.notes}</h5>
                            </div>
                          </InfoWindowF>
                        ) : null} </MarkerF>
                    :
                    <MarkerF key={c.key}  title={c.location} onClick={() => handleActiveMarker(c.key,c)} position={c.codinates} icon={"/images/mapPointer/map-point-rehome_.png"} >
                          {activeMarker && c.key && activeMarker === c.key ? (
                          <InfoWindowF onCloseClick={clearSelectedMarker}>
                            <div>
                              <b>{"Rehome Center"}</b>
                              <br/><b>{c.name}</b>
                              <hr></hr>
                              <br></br>
                              <h5>{c.notes}</h5>
                            </div>
                          </InfoWindowF>
                        ) : null}
                    </MarkerF>
              : <></> ))}  
              
            </GoogleMap>
          ) 
          : (
            <></>
          )
          
          }
</div>
{activeMarker != null &&(
  
  <a href="#divContainer" onClick={clearSelectedMarker}>
              <div className="scroll-arrow">TOP</div>
              <div id="scroll-text">top</div>
            </a>

)}
          
</div>
    </div>
  );
};

export default CouncilMap;