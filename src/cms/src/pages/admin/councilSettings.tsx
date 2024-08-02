"use client";

import React, { useEffect, useState } from "react";
import prisma from "../../utils/prisma";
import { supabase } from "../../utils/supabaseClient";
import { StorageError } from "@supabase/storage-js";

import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";
import { PrismaPromise, UserRole } from "@prisma/client";

import {
    Card,
    TextField,
    Autocomplete,
    Button,
} from "@mui/material";


import { getUserFromDb } from "../../utils/requireAuth";
import Layout from "../../components/admin/layout";
import { CouncilChangeRequest, OkResponse } from "../api/council/changePhoto";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const user = await getUserFromDb(ctx);

    if (
        "error" in user ||
        (user.role !== "ADMIN" && user.role !== "SUPERADMIN") ||
        !user.councilId
    ) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            },
        };
    }

    const council = user.role ==="SUPERADMIN" ? await prisma.council.findMany({orderBy:{name:'asc'}}) : await prisma.council.findMany({where: {
         id: user.councilId,
      },})

    return {
        props: {
            // WARNING: overwrite wrong type inference, this is not secure
            user: user as {
                email: string;
                role: UserRole;
                councilId: number;
            },
            council,
        },
    };
};


export default function CouncilMan({
    user,
    council,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [councilId, setcouncilId] = useState(user.councilId);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState<File | undefined>(undefined);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [isImageFromDB, setIsImageFromDB] = useState(false);
    //const [uploadImageURL, setUploadImageURL] = useState(null);

    
    function saveImage(): void {
        if(confirm("Do you want to save ?")){
                if(selectedImageFile)
                    uploadImage(selectedImageFile);
                    else{
                        alert("No image selected to upload");
                    }
        }
       
    }

    async function DeleteImage(){
        if(confirm("Do you want to delete ? ")){
            let selectedCouncil =  council.find((cl) => cl.id == councilId);
            if (selectedCouncil && selectedCouncil.councilImage){
                const imageData = supabase.storage.from("council_image").getPublicUrl(selectedCouncil.councilImage);
                if(imageData && selectedCouncil?.councilImage){
                    //setSelectedImage(imageData?.data?.publicUrl);
                    let pathList = [];
                    pathList.push(selectedCouncil.councilImage);
                    
                    const {
                        data,
                        error,
                      } =
                      await supabase.storage.from("council_image").remove(pathList);
                      
                      if(error){
                        alert(error);
                      }else{
                        clearImage();
                      }

                      onUpdateImageModal('',councilId);

                    alert("File succesfully deleted !")
                }else{
                    alert("No image to delete!")
                }
            }else{
                alert("Please select council first !!")
            }
            
        }
    }

    async function uploadImage(e: any) {
        try {
            
          const file = e;
            let fileName = councilId+"_"+file.name;
          const {
            data,
            error,
          }: { data: { path: string } | null; error: StorageError | null } =
            await supabase.storage.from("council_image").upload(`${fileName}`, file);
            
          if (error) {
            // if(error.statusCode === "409"){
            //     console.log(error);
            //     setIsImageFromDB(true);
            //     alert("File update error : Same file exists.");
            // }else{
                alert("File update error");
                setIsImageFromDB(false);
                console.log(error);
           // }
          }else{
            onUpdateImageModal(fileName,councilId);
            setIsImageFromDB(true);

            council.find((c)=> c.id == councilId)!.councilImage = fileName;


            alert("File uploaded successfully");
          }

        } catch (error: any) {
          console.log("Error uploading file: ", error.message);
        }
        
        // await refreshCouncilList();
      }

      const onUpdateImageModal = async (imageName: string , councilId : number) => {
       
        if (!councilId) {
            alert("error, no council id found");
            return;
          }
          
    
        const res = await fetch("/api/council/changePhoto", {
          method: "POST",
          body: JSON.stringify({
            councilId: councilId,
            councilImage : imageName
          } as CouncilChangeRequest),
        });
    
        if (res.ok) {

            council.find((c)=> c.id == councilId)!.councilImage = null;
            const newMethod = (await res.json()) as OkResponse;
          
        } else {
          alert("Failed to update photo");
        }
      }

      // find council image
    function loadCouncilImage(id: any) {
        
      let selectedCouncil =  council.find((cl) => cl.id == id);
      if (selectedCouncil){
        
      if (selectedCouncil.councilImage){
            const imageData = supabase.storage.from("council_image").getPublicUrl(selectedCouncil.councilImage);
            if(imageData){
                let _url = imageData?.data?.publicUrl;
                if(_url)
                { 
                    setSelectedImage(_url.toString());
                    setIsImageFromDB(true);
                }
            }
        }else{
                clearImage();
            }
      }else{
        alert("Please select council first !!")
      }
    }

    
    function clearImage(): void {
        setSelectedImage("");
        setSelectedImageFile(undefined);
        setIsImageSelected(false);
        setIsImageFromDB(false);
        
    }

   async function refreshCouncilList() {
        council = await  prisma.council.findMany({});
    }


    // This will run one time after the component mounts
  useEffect(() => {
    // callback function to call when event triggers
    const onPageLoad = () => {
        loadCouncilImage(user.councilId);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad, false);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);


    return (

        <Layout user={user}>
            <Card className="rounded-md p-5">
                <header className="flex flex-col items-center justify-between">
                    <h6 className="text-2xl">Council Management</h6>
                </header>

                <hr />

                <br>
            </br>
<div>
            <table width={"100%"} >
                <tbody>
                <tr>
                    <td colSpan={2}>
                        <div>

                                <Autocomplete
                                    fullWidth={true}
                                    className="w-full max-w-xl"
                                    options={council}
                                    placeholder=""
                                    defaultValue={ council.find((type) => type.id === councilId) || null}
                                    onChange={(_, value) => {
                                        if (value) {
                                            clearImage();
                                            setcouncilId(value.id);
                                            loadCouncilImage(value.id)
                                        }
                                    }}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            autoFocus={true}
                                            label="Select Council"
                                        />
                                    )}
                                />
<br></br>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                    {selectedImage && (
                        <div>
                            <img
                                alt="not found"
                                width={"450px"}
                                src={ selectedImage }
                            />
                            <br />
                            
                        </div>
                    )}
                    </td>
                    <td>
                
                    </td>
                </tr>
                <tr>
                    <td>
                            {councilId > 0 && (
                            <div>
                            <input
                                type="file"
                                name="myImage"
                                accept="image/png, image/jpeg"
                                alt="Please upload images only"
                                onChange={(event) => {
                                    if(event.target.files){
                                    setSelectedImage(URL.createObjectURL(event.target.files[0])); 
                                    setSelectedImageFile(event.target.files[0]); 
                                    setIsImageSelected(true);
                                    }
                                }
                            } /> 
                            <p >** Please upload image file only (Eg: png,jpeg)</p>
                            </div>
                        )}
                    </td>
                </tr>
                <tr>
                    <td> <br />
                <br />
                        <Button variant="outlined" color="success" disabled={!isImageSelected} onClick={()=>saveImage()}>
                            Save
                        </Button>

<Button variant="outlined" disabled={!isImageFromDB} onClick={() => DeleteImage() } style={{marginLeft:"5px"}} >Delete image</Button>

                    </td>
                </tr>
                </tbody>
            </table>
            </div>

               
                <br />


            </Card>
        </Layout>
    );
}


 

