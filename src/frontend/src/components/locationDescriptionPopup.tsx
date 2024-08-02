import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// const style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24
// };


interface locationExpanderProps {
    location: string;
    address: string;
    imageName : string;
    notes: string;
    link: string;
    frequency: string;
    showlocation: boolean;
  }

const LocationDescModal : React.FC<locationExpanderProps> = ({
    location,
    notes,
    imageName,
    address,
    link,
    frequency,
    showlocation,
  }) => {
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <Button onClick={handleOpen}>{location}</Button> */}
      <div id="resultRow" className='councilSearchButton' style={{width:"100%"}}>  
      {/* onClick={handleOpen}  */}
      {/*show minimum content when the item is not being opened*/}
      <div
        className={`flex flex-row items-center mb-2 }`}
        // onClick={toggleExapnder}
      >
        <img
          src={`/images/mapPointer/`+imageName}
          className={`w-["10%"] `}
        />
        <p
          className={`flex items-center max-w-xs pickle-green-text text-left font-bold text-[3.9vw] sm:text-[2.8vw] md:text-[2.3vw] lg:text-[1.8vw] xl:text-[0.9vw]
          `}
        >
          { location}
        </p>
      </div>
    </div>
      {/* <Modal
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
              src={`/images/mapPointer/`+imageName}
              className={"w-[12vw] sm:w-[5vw] md:w-[4vw] lg:w-[3.5vw] xl:w-[9.8vw] rounded-lg mr-2"}
            />
                  </td>
                  <td>
               {location}
                    
                  </td>
                </tr>
              </table>
            </p>
            
          <p className="text-center text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]">
            {" "}
            <a
              href={link}
              className="underline bold"
              target="_blank"
              style={{ color: "green" }}
            >
              visit website
            </a>{" "}
          </p>

          <p className="my-1 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center" >
              <span className="font-bold">Location: </span>
              {address}
          </p>
          

          {frequency && frequency?.length > 0 && (
            <p className="my-1 text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center" >
              <span className="font-bold">Frequecy:</span> {frequency}
            </p>
          )}

          {notes?.length > 0 && (
            <>
              <span className="text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center font-bold block -mb-[10px]">
                Notes
              </span>
              <span className="drop-off-separater block mb-2 ml-[8%] text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw]"></span>
            </>
          )}
          <p className="text-[3.2vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1.3vw] text-center">{notes}</p>
        </div>
         <button className="close-button" onClick={handleClose}>Show on map</button>
        </Box>
      </Modal> */}
    </div>
  );
}

export default LocationDescModal;