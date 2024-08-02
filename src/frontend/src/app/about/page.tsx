import React from "react";
import { ReactNode } from "react";
import Card from "../../components/Card";
import Footer from "../../components/Footer";

// Component is used to display card like information (i..e, texts etc.)
const About: React.FC = () => {
    return(
        <div className="flex flex-col">
        <Card>
          <div style={{ display: 'flex' }}>
            <div  style={{ flex: '1 1 30%' }} >
              <h1 className="text-[5vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.2vw] xl:text-[1.7vw] font-semibold mb-2"> About Us</h1>
              <br></br><br></br>
              <p className="text-[3.5vw] sm:text-[2.5vw] md:text-[2vw] lg:text-[1.5vw] xl:text-[1vw] flex flex-col item-start space-y-2">
              <span><i>binfluence™</i> is a product from GreenQueen, a business dedicated to helping to reduce waste in our environment..</span>
              <span>We want to make it easier for people to understand recycling as well as learning about options to divert waste from your bins.</span>
              <span>We want to influence your bins (binfluence, get it?!) - sharing information and education to get people closer to zero waste.</span>
            </p>
            </div>
            <div  style={{ flex: '1' }} >
              <img src="/images/GreenQueen_logo.png" style={{width:"50%", marginLeft:"20%"}}></img>
            </div>
         
          </div>
        </Card>
        
        </div>
    )
}

export default About;