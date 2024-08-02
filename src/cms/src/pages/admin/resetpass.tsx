import Box from "@mui/material/Box";
import Image from "next/image";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import { supabase } from "../../utils/supabaseClient";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Link from "next/link";
import CircularProgress from '@mui/material/CircularProgress';


export default function Resetpass() {
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [passwordsuccess,setpasswordsuccess] = useState(false);
    const [loading,setloading] = useState(false)
    const resetpassword = async (event:any) =>{
        event.preventDefault()
        console.log("reset password callled")
        //console.log(password)
        //console.log(email)
        setloading(true)
        try{
            let {data,error} = await supabase.auth.updateUser({
                email:email,
                password:password
            })
            if (data){
                console.log("Password reset Successfull")
                setpasswordsuccess(true)
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
    {loading && <CircularProgress />}
    
    </Box>
    {passwordsuccess &&  <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
     Password reset successful, Click <Link href={"/admin"} style={{textDecoration:"underline"}}>here</Link> to go back to Login Page
    </Alert>}
   
    <form onSubmit={resetpassword}>
    <TextField
        placeholder="Please enter your email address"
        label="Email"
        variant="outlined"
        fullWidth
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: 2 }}
    />
     <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        <Button disabled={passwordsuccess} variant="outlined" type="submit"
        >
         Reset Password
        </Button>
      </Box>
    </form>
    
     </Box>
    );
}