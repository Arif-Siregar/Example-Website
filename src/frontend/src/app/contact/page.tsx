"use client";
import Footer from "../../components/Footer";
import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../../components/Card";
import DOMPurify from "dompurify";
//import CircularProgress from '@mui/material/CircularProgress';

// function used to control the contact form
export default function ContactForm() {
  // states used to control the inputs:
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");
  //const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formvalues,setformvalues] = useState({
    name:"",
    email:"",
    message:""
  })

  const sendEmail = async () => {
    // check if the any of the values are empty
    if (!formvalues.name || !formvalues.message || !formvalues.email) {
      toast.error("Please fill out all info!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    // Else we check the email first
    try {
      setLoading(true);
      const response = await axios.post("/api/contact", {
        email: formvalues.email,
        name: formvalues.name,
        message: formvalues.message,
      });
      //console.log(response)
      //console.log("debug mail issue")
      if (response.status === 200) {
        toast.success(
          "Thanks for your message! We love to hear from people and will get back to you if needed.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } else {
        toast.error("Enter a valid email address");
      }
     setformvalues({
      name:"",
      email:"",
      message:""
     })
    } catch (error: any) {
      console.log("feedback failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-rows-1">
      <p className="xl:text-[1.2vw]">
        <span>
        Get in touch to tell us about a recycling, rehome or repair scheme in your area that we don&apos;t know about yet.
        </span><br/>
        <span>
        If there&apos;s anything else that&apos;s not right for your area, please let us know! Or if you just want to say hi, please reach out, we&apos;d love to hear from you!
        </span><br/>
        <span>
          Fill out the form or send us an email to {""}
          <a
            href={`mailto:binfluence.aus@gmail.com`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            binfluence.aus@gmail.com
          </a>
        </span>
      </p>
      {loading && 
      <div className="flex justify-center mt-6">
      <div className="gird">
      <div className="flex justify-center">
      {/* <CircularProgress color="inherit" /> */}
      </div>
      <p className="mt-4">Sending your message !!</p>
      </div>
      </div>}
      <div
        style={{
          alignContent: "center",
          display: "flex",
          justifyContent: "center",
          marginTop:"3%"
        }}
      >
        <Card>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center">
              <img
                src="/favicon.ico"
                alt="Visit Us"
                className="w-[10vw] sm:w-[10vw] md:w-[8vw] lg:w-[7vw] xl:w-[5vw] rounded-full"
              />
              <h1 className="font-semibold text-[5vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.2vw] xl:text-[1.7vw]">
                {" "}
                Give us your Feedback
              </h1>
            </div>

            <div className="space-y-1 text-[3vw] sm:text-[2.8vw] md:text-[2.2vw] lg:text-[1.5vw] xl:text-[1.2vw]">
              <label htmlFor="name">Name: </label>
              <input
                className="p-2 rounded-lg focus:outline-none focus-border-gray-700"
                id="name"
                type="text"
                required
                style={{ width: "100%" }}
                value={formvalues.name}
                onChange={(e) => setformvalues({...formvalues,name:e.target.value})}
                placeholder="Type your name here..."
              />
              <div>
                <label htmlFor="email">Email: </label>
                <input
                  className="p-2 rounded-lg focus:outline-none focus-border-gray-700"
                  id="email"
                  required
                  type="text"
                  style={{ width: "100%" }}
                  onChange={(e) => setformvalues({...formvalues,email:e.target.value})}
                  placeholder="Type your email here..."
                  value={formvalues.email}
                />
              </div>

              <div>
                <label htmlFor="message">Message: </label>
                <textarea
                  className="p-2 rounded-lg focus:outline-none focus-border-gray-700 max-h-[10vh]"
                  id="message"
                  rows={4} // Adjust the number of rows as needed
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    setformvalues({...formvalues,message:e.target.value})
                  }
                  placeholder="Type your message here..."
                  required
                  value={formvalues.message}
                />
              </div>
            </div>
            <button
              className="text-[5vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.2vw] xl:text-[1.7vw] font-semibold mt-2 border-solid py-[0.5] px-3 border-2 border-[rgb(var(--navy-black))] rounded-lg active:border-[rgb(var(--light-white))] active:text-[rgb(var(--light-white))]"
              onClick={sendEmail}
            >
              Submit
            </button>
          </div>
        </Card>
      </div>
      <ToastContainer />
      </div>
    </div>
  );
}
