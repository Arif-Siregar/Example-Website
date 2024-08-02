import Box from "@mui/material/Box";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import { supabase } from "../../utils/supabaseClient";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';


export default function Resetpassemail() {
    const [email, setEmail] = useState("");
    const [emailsuccess,setemailsuccess] = useState(false);
    const [loading,setloading] = useState(false)
    const [validmail,setvalidmail]= useState(false);
    const regex : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const sendemail = async (event:any) =>{
        event.preventDefault()
        console.log("send email called")
        //console.log(email)
        setloading(true)
        try{
            let {data,error} = await supabase.auth.resetPasswordForEmail(email)
            if (data){
                console.log("Email Send Successfully")
                setemailsuccess(true)
                setloading(false)
            }
            else{
                console.log(error)
            }
        }
        catch(error){
            console.log(error)
        }
    }
    const validateemailaddress = (val:string) =>{
        if(regex.test(val)){
          setvalidmail(true)
        }
        else{
          setvalidmail(false)
        }
    }
    return(
    <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "",
          gap: 3,
          width: "50%",
          height: "50%",
          maxWidth: 400,
          margin: "auto",
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
    >
    
    <Image
        className=""
        src="/images/logo.jpg"
        height={600}
        width={1200}
        alt={`logo avatar`}
    />
    <Box sx={{ display: 'flex', justifyContent:'center'}}>
    {loading && <CircularProgress/>}
    </Box>
    {emailsuccess && <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
     Email Sent Successfully, Please check your mailbox
    </Alert>}
    
    <form onSubmit={sendemail}>
    <TextField
        placeholder="Please enter your email address"
        label="Email"
        variant="outlined"
        fullWidth
        name="email"
        value={email}
        onChange={(e) => {setEmail(e.target.value)
        validateemailaddress(e.target.value)
        }}
        sx={{ marginBottom: 2 }}
    />
     <Box
        sx={{
          display: "grid",
          width: "100%",
          gap: 2,
          marginTop: 2,
          position:""
        }}
      >
        <Button disabled={emailsuccess || !validmail} variant="outlined" type="submit"
        >
          Send Password Recovery Mail
        </Button>
      </Box>
    </form>
    
     </Box>
    );
}