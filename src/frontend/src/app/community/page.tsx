import Footer from "../../components/Footer";
import Card from "../../components/Card";
import Link from "next/link";

const Community: React.FC = () => {
  return (
    <div>
      <Card>
        {/* <p> Here are our benefits to the selected council:</p> */}
        <h2 className="text-[5vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.2vw] xl:text-[1.7vw] font-bold mb-2">Local community schemes</h2>
        <p className="text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw]">
          This space is where you can learn about all the amazing initiatives
          happening in your local area. It’s divided by option to help you
          manage your item in the way that works for you.
        </p>
      </Card>
      <div
      className="grid grid-cols-4 grid-rows-2 gap-x-0 gap-y-0 mt-[10px]"
       >
        
    <div className="col-span-4 row-span-2 flex justify-center">
    <Link
          href="./community/recycle"
    ><img src="/images/Recycle_Pyramid.png" className="object-contain h-[24vh] w-[30vw]"></img></Link>
 
    </div>


    <div className="col-span-4 row-span-2 grid grid-cols-2 justify-items-center">
    <Link
          href="./community/reuse"
    > <img src="/images/Rehome_Pyramid.png" className="object-contain h-[24vh] w-[30vw]"></img></Link>
    
    <Link
          href="./community/repair"
    ><img src="/images/Repair_Pyramid.png" className="object-contain h-[24vh] w-[30vw]"></img></Link>
 
    </div>


    {/* <div className="col-span-2 row-span-2 border flex justify-center">
    <img src="/images/Recycle_Pyramid.png" className="object-contain h-[24vh] w-[30vw]"></img>
    </div> */}

        {/* <Link
          href="./community/reuse"
          className="flex items-center rounded-full border-2 px-4 py-1 text-white font-semibold home-navi-button sm:py-4"
        >
          <span className="flex-grow text-center">
            Reuse and rehome
          </span>
          <span>➤</span>
        </Link>
        <Link
          href="./community/repair"
          className="flex items-center rounded-full border-2 px-4 py-1 text-white font-semibold home-navi-button"
        >
          <span className="flex-grow text-center">
            Repair
          </span>
          <span>➤</span>
        </Link>
        <Link
          href="./community/recycle"
          className="flex items-center rounded-full border-2 px-4 py-1 text-white font-semibold home-navi-button sm:py-4"
        >
          <span className="flex-grow text-center">
            Recycle
          </span>
          <span>➤</span>
        </Link>
        <Link
          href="./community/sustainability"
          className="flex items-center rounded-full border-2 px-4 py-1 text-white  font-semibold home-navi-button"
        >
          <span className="flex-grow text-center">
            Sustainability initiatives
          </span>
          <span>➤</span>
        </Link> */}

      </div>
      <br/><hr/><br/>
        <Link href="mapp" color="primary" className="px-4 black-search-border margin_left_40">
          Click here to load council Map
        </Link>
    </div>
  );
};
export default Community;