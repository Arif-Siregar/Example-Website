"use client";

import { useState } from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Box
      component="form"
      action={"../api/auth/sign-in"}
      method="post"
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
      <TextField
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
        <Button variant="outlined" type="submit"
        >
          Sign In
        </Button>
        <div className="flex justify-center hover:underline">
        <Link prefetch={false} href={"/admin/resetpassemail"}>
          Forgot Password
        </Link>
        </div>
        
      </Box>
    </Box>
  );
}
