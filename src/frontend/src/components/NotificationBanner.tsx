import { XMarkIcon } from '@heroicons/react/20/solid'
import { useContext, useEffect, useState } from 'react'
import { NotificationContext, useCouncilContext } from "../providers";




export default function NotificationBanner() {
    const homeCouncil = useCouncilContext();
    const NotificationContexts:any = useContext(NotificationContext)
    const [bannercontent,setbannercontent] = useState({
        heading:"",
        message:"",
        link:""
    })
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shownoti,setshownoti] = useState(false)

    const [bannerarray,setbanneraaray] = useState([])

    const changeshownoti = () =>{
      setshownoti(!shownoti)
      NotificationContexts.updateNotificationstatus(!NotificationContexts.notificationstatus)
  }

  const handlelinkclick = (e:any) =>{
    //window.location.replace(bannercontent.link)
    e.preventDefault();
    if(bannercontent.link.includes("frontend-git-preview") || bannercontent.link.includes("www.binfluence.com.au"))
    {
      window.open(bannercontent.link,"_self")
    }
    else
    {
    window.open(bannercontent.link,"blank")
    }
  }

    useEffect(() => {
      // initialising based on the current
      if (homeCouncil.councilValue != null) {
        const paramValue = homeCouncil.councilValue.split(",")[0].trim();
        fetch(`/api/notifications/fetchnotifications?specificCouncil=${paramValue}`)
          .then((res) => res.json())
          .then((data) => {
            // setBinsData(data);
            // setLoadingBins(false);
            setbanneraaray(data)
            if(data.length>0)
            {
              setbannercontent(data[0])
              setshownoti(true)
              NotificationContexts.updateNotificationstatus(true)
            }
            else{
              setbannercontent({
                heading:"",
                message:"",
                link:""
              })
              setshownoti(false)
              NotificationContexts.updateNotificationstatus(false)
            }
            
          })
          .catch((error) => {
            console.log(
              "failed to fetch bins information based on the home council"
            );
          });
        let timeoutId:any;
        return () => {
            clearTimeout(timeoutId);
        };
      } else {
        console.log(
          "no longer preparing bins info given no homecouncil has been selected."
        );
      }
    }, [homeCouncil.councilValue]);

    useEffect(() => {
      // Use setTimeout to update currentIndex every 5 seconds
      const timeoutId = setTimeout(() => {
        if(bannerarray.length>0)
        {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerarray.length);
        setbannercontent(bannerarray[currentIndex])
        }
      }, 5000);
  
      // Clean up function to clear the timeout when the component is unmounted or when dataArray changes
      return () => {
        clearTimeout(timeoutId);
      };
    }, [currentIndex, bannerarray,homeCouncil.councilValue]);
    // const bannerarray = [
    //     {bannerheading:"Heading1",bannermessage:"FirstMessage",bannerlink:"FirstLink"},
    //     {bannerheading:"Heading2",bannermessage:"The sun dipped below the horizon, casting a warm golden glow across the tranquil lake. The gentle ripples on the water mirrored the fading colors of the sky, creating a serene and magical atmosphere. As the stars began to twinkle overhead, a soft breeze rustled through the leaves of the surrounding trees. It was a moment of quiet beauty, where time seemed to slow down, and the world felt perfectly at peace",bannerlink:"Click here to go the message"},
    //     {bannerheading:"Heading3",bannermessage:"In the heart of the bustling city, neon lights painted the streets with vibrant hues. The sounds of laughter, car horns, and distant music created a symphony of urban life. People hurriedly walked along the sidewalks, each lost in their own thoughts and destinations. Street vendors offered an array of tempting treats, filling the air with delicious aromas. Skyscrapers towered above, reflecting the ever-changing skyline. Amidst the chaos, there was a certain energy—a pulse that defined the rhythm of the metropolis",bannerlink:"Click here to go the link"}
    // ]

   

    // setTimeout(() => {
    //     if(count!=bannerarray.length-1){
    //     setbannercontent(bannerarray[count+1])
    //     setcount(count+1)
    //     }
    //     else if(count==bannerarray.length-1){
    //         setbannercontent(bannerarray[0])
    //         setcount(0)
    //     }
    // }, 5000);

  return (
    <div>
    {shownoti && <div className="relative bg-dark-green isolate flex items-center gap-x-6 overflow-hidden  px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      
  
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-md" style={{color:"white"}}>
          {bannercontent.heading!="" && 
          <strong className="font-semibold">{bannercontent.heading} 
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx={1} cy={1} r={1} />
          </svg>
          </strong>
          }
          {bannercontent.message}
        </p>
        {bannercontent.link!="" && <a
          href={bannercontent.link}
          onClick={handlelinkclick}
          className="flex-none rounded-full px-3.5 py-1 text-sm font-semibold border-2"
          style={{color:"white"}}
        >
          Read more <span aria-hidden="true">&rarr;</span>
        </a>}
        
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-gray-900" aria-hidden="true" onClick={changeshownoti}/>
        </button>
      </div>
    </div>}
    </div>
  )
}
