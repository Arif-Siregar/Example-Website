import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React, { useEffect, useState, useMemo, } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from '@mui/material/CircularProgress';
import {
  Switch,
  Grid,
  Button,
  FormControl,
  TextField,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";

import type {
  ResponseData as UpdateResponseData,
  RequestInput as UpdateRequestInput,
} from "../api/community/update"
import type {
  ResponseData as CreateResponseData,
  RequestInput as CreateRequestInput,
} from "../api/community/create";
import type{
  //ResponseData as CreateResponseDataCommType,
  RequestInput as CreateRequestInputCommType,
} from "../api/community_communityType/create";
import type{
  //ResponseData as CreateResponseDataCommItem,
  RequestInput as CreateRequestInputCommItem,
} from "../api/community_item/create";
import prisma from "../../utils/prisma";
import { getUserFromDb } from "../../utils/requireAuth";
import Layout from "../../components/admin/layout";
import CustomizedHook from "../../components/admin/customizedHook";
import MultipleSelectCheckmarks from "../../components/admin/MultipleSelectCheckmarks";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Notes, Padding } from "@mui/icons-material";
import { itemCommunity } from "../api/itemCommunity";
import { communityType } from "../api/communityType";
import { bool } from "prop-types";

type communityDisplayData = {
  communityid:number,
  councilid:number | null,
  name:string,
  link:string | null,
  location:string,
  frequency:string | null,
  method:string,
  notes:string | null,
  itemArray:itemCommunity[],
  communityTypeArray:communityType[]
}



interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}


function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, alignSelf: "left" }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const user = await getUserFromDb(ctx);
  //to solve build failure after community changes

  if ("error" in user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN") || !user.councilId) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  // TODO use sql and pagination to save traffic
  // const methods = await prisma.community.findMany({
    
  // });

  const communities = await prisma.community.findMany({
    select:{
      communityId:true,
      councilId:true,
      name:true,
      link:true,
      location:true,
      frequency:true,
      method:true,
      notes:true,
      Community_communitytype_mappings:{
        include:{
          communitytype:{
            select:{
              communitytypeId:true,
              name:true
            }
          }
        }
      },
      Community_item_mappings:{
        include:{
          item:{
            select:{
              id:true,
              name:true
            }
          }
        }
      }
    }
  })

  //console.log(communities)
  let community_display_array:communityDisplayData[]=[]
  for(const c of communities){
    let community_type_data_array : communityType[]=[]
    c.Community_communitytype_mappings.forEach((comm)=>{
      const typeObj : communityType = {
        communitytypeId:comm.communitytype.communitytypeId,
        name:comm.communitytype.name
      }
      community_type_data_array.push(typeObj)
     })
     let community_item_data_array : itemCommunity[]=[]
     c.Community_item_mappings.forEach((comm)=>{
      const itemObj : itemCommunity = {
        itemId:comm.item.id,
        itemName:comm.item.name
      }
      community_item_data_array.push(itemObj)
     })
     community_display_array.push({
      communityid:c.communityId,
      councilid:c.councilId,
      name:c.name,
      link:c.link,
      location:c.location,
      frequency:c.frequency,
      method:c.method,
      notes:c.notes,
      itemArray:community_item_data_array,
      communityTypeArray:community_type_data_array
     })


  }

 

  // for (const m of methods){
  //   const community_item_data = await prisma.community_item_mapping.findMany({
  //     where :{
  //       communityId:m.communityId
  //     },
  //     select:{
  //       itemId:true,
  //       item:{
  //         select:{
  //           name:true
  //         }
  //       }
  //     }
  //    });
  //    let community_item_data_array : itemCommunity[]=[]
  //    community_item_data.forEach((comm)=>{
  //     const itemObj : itemCommunity = {
  //       itemId:comm.itemId,
  //       itemName:comm.item.name
  //     }
  //     community_item_data_array.push(itemObj)
  //    })
  //    const community_type_data = await prisma.community_communitytype_mapping.findMany({
  //     where:{
  //       communityId:m.communityId
  //     },
  //     select:{
  //       communitytypeId:true,
  //       communitytype:{
  //         select:{
  //           name:true
  //         }
  //       }
  //     }
  //    });
  //    let community_type_data_array : communityType[]=[]
  //    community_type_data.forEach((comm)=>{
  //     const typeObj : communityType = {
  //       communitytypeId:comm.communitytypeId,
  //       name:comm.communitytype.name
  //     }
  //     community_type_data_array.push(typeObj)
  //    })
  //    community_display_array.push({
  //     communityid:m.communityId,
  //     councilid:m.councilId,
  //     name:m.name,
  //     link:m.link,
  //     location:m.location,
  //     frequency:m.frequency,
  //     method:m.method,
  //     notes:m.notes,
  //     itemArray:community_item_data_array,
  //     communityTypeArray:community_type_data_array
  //    })
  // }

  


  const council = await prisma.council.findMany({
    orderBy:{
      name:'asc'
    }

  })

  return {
    props: { community_display_array, council, user },
  };
};

type MethodColumn = keyof communityDisplayData;

type FormCommunity = Pick<communityDisplayData, "name"|"link"|"location"|"frequency"|"method"|"notes"|"itemArray"|"communityTypeArray"> & { communityid?: number };



type CommunityFormProps = {
  open: boolean;
  mode: "Create" | "Edit";
  onCancel: () => void;
  onConfirm: (method: FormCommunity, mode: "Create" | "Edit") => void;
  formData: FormCommunity;
  setFormData: React.Dispatch<FormCommunity>;
  errorObj:any;
  seterrorObj:React.Dispatch<any>;
  loading:boolean;
  setloading:React.Dispatch<any>;
};

const CommunityForm: React.FC<CommunityFormProps> = ({
  onCancel,
  open,
  mode,
  onConfirm,
  formData,
  setFormData,
  errorObj,
  seterrorObj,
  loading,
  setloading
}) => {
  const handleSubmit = async (e: unknown) => {
    // @ts-ignore
    e.preventDefault();
    if (!formData) {
      alert("error, no form data");
      return;
    } else {
      onConfirm(formData, mode);
    }
  };

  const handledatafromCustomHook = (value:any)=>{
    setFormData({ ...formData, itemArray:value })
  }

  const handledatafromMultiCheck = (value:any)=>{
    setFormData({...formData,communityTypeArray:value})
  }

//let regexp : RegExp = /^\d+\s[\w\s,]+,\s[\w\s,]+,\s[\w\s]+,\s\d{4}$/
//let regexp : RegExp = /^(\d+|\d+-\d+)\s[\w\s,&]+,\s[\w\s,]+,\s[\w\s]+,\s\d{4}$/
let regexp : RegExp = /^(\d+(-\d+)?)?\s?[\w\s,&]+,\s[\w\s,]+,\s[\w\s]+,\s\d{4}$/


  const validateinput = (field:string,value:any) =>{
    if(field=="errorname" && value=="")
    {
      errorObj.errorname=true
    }
    else if(field=="errorname" && value!=""){
      errorObj.errorname=false
    }
    if(field=="errorlocation" && value=="")
    {
      errorObj.errorlocation=true
    }
    else if(field=="errorlocation" && value!=""){
      if(regexp.test(value)) // on success
      {
        
        errorObj.errorlocregex=false
      }
      else{ // on failure
        errorObj.errorlocregex=true
      }
      errorObj.errorlocation=false
    }
    if(field=="errormethod" && value=="")
    {
      errorObj.errormethod=true
      console.log("Print something")
    }
    else if(field=="errormethod" && value!=""){
      errorObj.errormethod=false
    }
    if(field=="errortype" && value.length==0)
    {
      errorObj.errortype=true
    }
    else if(field=="errortype" && value.length!=0){
      errorObj.errortype=false
    }
    if(field=="erroritem" && value.length==0)
    {
      errorObj.erroritem=true
      console.log("Print something")
    }
    else if(field=="erroritem" && value.length!=0){
      errorObj.erroritem=false
    }
    
    seterrorObj(errorObj)
  }


  return (
    <Dialog disablePortal open={open} onClose={onCancel} fullWidth={true}>
      <form className="p-5">
        {loading && 
            <div className="grid grid-rows-2">
            <div className="flex justify-center w-full">     
            <CircularProgress size={60}/>
            </div> 
            <div className="text-xl flex justify-center mt-6">Submitting your request, please wait..</div>
         
            </div>
             
        
        }
        {!loading && <div>
        <DialogTitle>{mode} Community Scheme</DialogTitle>
        <Typography>* Indicates mandatory fields</Typography>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <CustomizedHook  datafromparent={handledatafromCustomHook} valuefromparent={formData?.itemArray}  validatefromparent={validateinput}>
        </CustomizedHook>
        <p style={{color:"red"}}>{errorObj.erroritem?"Items are mandatory":""}</p>
          </Grid>
        <Grid item xs={12}>
        <MultipleSelectCheckmarks datafromparent={handledatafromMultiCheck} valuefromparent={formData?.communityTypeArray} errorfromparent={errorObj.errortype}
        validatefromparent={validateinput}>
        </MultipleSelectCheckmarks>
          </Grid>
        <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              minRows={3}
              fullWidth
              required
              value={formData?.name}
              onChange={(e) => {
                formData &&
                  setFormData({ ...formData, name: e.target.value });
                  validateinput("errorname",e.target.value)
              }}
              onBlur={(e)=>{
                validateinput("errorname",e.target.value)
              }}
              error={errorObj.errorname}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
              name="link"
              label="Website/Link"
              variant="outlined"
              minRows={3}
              fullWidth
              value={formData?.link}
              onChange={(e) => {
                formData &&
                  setFormData({ ...formData, link: e.target.value });
              }}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
              name="location"
              label="Location/Address"
              variant="outlined"
              multiline
              minRows={3}
              fullWidth
              required
              value={formData?.location}
              onChange={(e) => {
                formData &&
                  setFormData({ ...formData, location: e.target.value });
                  validateinput("errorlocation",e.target.value)
              }}
              onBlur={(e)=>{
                validateinput("errorlocation",e.target.value)
              }}
              error={errorObj.errorlocation}
            />
            <p style={{color:"red"}}>{errorObj.errorlocregex?"Note: Address should be entered in the format street number street name, suburb, state, postcode (e.g : 84 Geographe Street, Docklands, Victoria, 3008)":""}</p>
        </Grid>
        <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="demo-simple-select-label">Method*</InputLabel>
          <Select
            id="demo-simple-select"
            label="Age"
            minRows={3}
            value={formData.method}
            required
            onChange={(e) => {
              formData &&
                setFormData({ ...formData, method: e.target.value });
                validateinput("errormethod",e.target.value)
            }}
            onBlur={(e)=>{
              validateinput("errormethod",e.target.value)
            }}
            error={errorObj.errormethod}
          >
            <MenuItem value={"Collection"}>Collection</MenuItem>
            <MenuItem value={"DropOff"}>DropOff</MenuItem>
          </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
            <TextField
              name="frequency"
              label="Frequency"
              variant="outlined"
              minRows={3}
              fullWidth
              value={formData?.frequency}
              onChange={(e) => {
                formData &&
                  setFormData({ ...formData, frequency: e.target.value });
              }}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
              name="notes"
              label="Notes"
              variant="outlined"
              multiline
              minRows={3}
              fullWidth
              value={formData?.notes}
              onChange={(e) => {
                formData &&
                  setFormData({ ...formData, notes: e.target.value });
              }}
            />
        </Grid>
        
          <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!(formData.communityTypeArray.length>0 && formData.itemArray.length>0 && formData.name!="" && formData.location!="" && formData.method!="" && errorObj.errorlocregex==false)}>Confirm</Button>
          </DialogActions>
        </Grid>
        </div>}
      </form>
    </Dialog>
  );
};

type Order = "asc" | "desc";

interface HeadCell {
  id: MethodColumn;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {id:"name",label:"Name"},
  {id:"link",label:"Link/Website"},
  {id:"location",label:"Location/Address"},
  {id:"frequency",label:"Frequency"},
  {id:"method",label:"Method"},
  {id:"notes",label:"Notes"},
  {id:"itemArray",label:"Items"},
  {id:"communityTypeArray",label:"Types"}
];

export default function Community({
  community_display_array, council, user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [councilId, setcouncilId] = useState(user.councilId)
  // rows

  const [communityList, setcommunityList] = useState<communityDisplayData[]>(community_display_array);
  const [rows, setRows] = useState<communityDisplayData[]>(community_display_array.filter((m) => m.councilid === councilId));

  const [loading,setloading] = useState(false);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<MethodColumn>("communityid");
  const onHeaderCellClick = (property: MethodColumn) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  // sorting & pagination
  const visibleRows = useMemo(
    () =>
      rows
        .sort((a, b) => {
          const v1 = a[orderBy] ?? 0;
          const v2 = b[orderBy] ?? 0;
          const cmp = v1 === v2 ? 0 : v1 < v2 ? 1 : -1;
          return order == "asc" ? cmp : -cmp;
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage],
  );

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // table
  const [dense, setDense] = useState(false);
  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  useEffect(() => {
    // Check if the selected council is present in the query parameters
    if(user.role=="SUPERADMIN")
    {
    let selectedcouncil  = localStorage.getItem('communityselectedCouncil');
    if (selectedcouncil) {
      let newselectedcouncil = parseInt(selectedcouncil)
      setcouncilId(newselectedcouncil)
      setRows(communityList.filter((m) => m.councilid === newselectedcouncil));
    } 
  }
  }, [councilId]);


  // forms
  type FormMode = "Create" | "Edit";
  const [openModal, setOpenModal] = useState(false);
  const [ItemArray,setItemArray] = useState<itemCommunity[]>([])
  const [CommunityTypeArray,setCommunityTypeArray] = useState<communityType[]>([])
  const [formInitValue, setFormInitValue] = useState<FormCommunity>({
    link:"",
    notes:"",
    location:"",
    method:"",
    name:"",
    itemArray:ItemArray,
    communityTypeArray:CommunityTypeArray,
    frequency:""
  });
  const [errorObj,seterrorObj] = useState({
    errorname:false,
    errorlocation:false,
    errormethod:false,
    errortype:false,
    erroritem:false,
    errorlocregex:false
  })


  const [mode, setMode] = useState<FormMode>("Create");
  const onFormConcel = () => setOpenModal(false);
  const onFormConfirm = async (comm: FormCommunity, mode: FormMode) => {
    setloading(true)
    if (mode == "Edit") {
      try {
        const response = await fetch(`/api/community/update/`, {
          method: "POST",
          body: JSON.stringify({
            communityId:comm.communityid,
            councilId:councilId,
            name:comm.name,
            link:comm.link,
            location:comm.location,
            frequency:comm.frequency,
            method:comm.method,
            notes:comm.notes
          } as UpdateRequestInput),
        });
        const data: UpdateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to update method");
        } else {
          try {
            const response = await fetch(`/api/community_item/delete/`, {
              method: "DELETE",
              body: JSON.stringify({
                communityId: data.communityId,
              }),
            });
            const data_item: CreateResponseData = await response.json();
            if ("error" in data_item) {
              console.error(data_item.error);
              alert("Failed to delete Community Item");
            }
            else{
              const community_item_map = comm.itemArray.map((item)=>{
                return{
                  communityId:data.communityId,
                  itemId:item.itemId
                }
              })
              // let community_item_map: { communityId: number; itemId: number; }[] = []
              // comm.itemArray.forEach((item)=>{
              //   community_item_map.push({
              //     communityId:data.communityId,
              //     itemId:item.itemId
              //   })
              // })
              try{
                    const response = await fetch(`/api/community_item/create/`, {
                      method: "POST",
                      body: JSON.stringify({
                        community_item_map:community_item_map
                      } as CreateRequestInputCommItem),
                    });
                    const dataItem: CreateResponseData = await response.json();
                    if ("error" in data) {
                      console.error(data.error);
                      alert("Failed to create method ");
                    } else {
                      console.log(dataItem)
                    }
              }
              catch(error){
                console.log(error)
              }
               //item_map start
                //     community_item_map.forEach(async (commitem)=>{
                //   try{
                //     const response = await fetch(`/api/community_item/create/`, {
                //       method: "POST",
                //       body: JSON.stringify({
                //         communityId:commitem.communityId,
                //         itemId: commitem.itemId
                //       } as CreateRequestInputCommItem),
                //     });
                //     const dataItem: CreateResponseData = await response.json();
                //     if ("error" in data) {
                //       console.error(data.error);
                //       alert("Failed to create method ");
                //     } else {
                //       console.log(dataItem)
                //     }
                //   }
                //   catch(error){
                //     console.log("Error in Item")
                //   }
                // })
                //item_map end
              

            }
          }
          catch(error){
            console.log(error)
          }
          try{
            const response_type = await fetch(`/api/community_communityType/delete/`, {
              method: "DELETE",
              body: JSON.stringify({
                communityId: data.communityId,
              }),
            });
            const data_type: CreateResponseData = await response_type.json();
            if ("error" in data_type) {
              console.error(data_type.error);
              alert("Failed to delete Community Item");
            }
            else
            {
              const community_type_map = comm.communityTypeArray.map((type)=>{
                return {
                  communityId:data.communityId,
                  communitytypeId:type.communitytypeId
                }
              })
              // let community_type_map: { communityId: number; communitytypeId: number; }[]=[]
              // comm.communityTypeArray.forEach((type)=>{
              //   community_type_map.push({
              //     communityId:data.communityId,
              //     communitytypeId:type.communitytypeId
              //   })
              // })
                  //type_map start
              try{
                  const response = await fetch(`/api/community_communityType/create/`, {
                    method: "POST",
                    body: JSON.stringify({
                     community_type_map:community_type_map
                    } as CreateRequestInputCommType),
                  });
                  const dataType: CreateResponseData = await response.json();
                  if ("error" in data) {
                    console.error(data.error);
                    alert("Failed to create method ");
                  } else {
                    console.log(dataType)
                  }
              }
              catch(error){
                console.log(error)
              }
              // community_type_map.forEach(async (commtype)=>{
              //   try{
              //     const response = await fetch(`/api/community_communityType/create/`, {
              //       method: "POST",
              //       body: JSON.stringify({
              //         communityId:commtype.communityId,
              //         communitytypeId: commtype.communitytypeId
              //       } as CreateRequestInputCommType),
              //     });
              //     const dataType: CreateResponseData = await response.json();
              //     if ("error" in data) {
              //       console.error(data.error);
              //       alert("Failed to create method ");
              //     } else {
              //       console.log(dataType)
              //     }
              //   }
              //   catch(error){
              //     console.log("Error in Type")
              //   }
              // })
              //type_map end
              const newdata = {
                communityid:data.communityId,
                councilid:councilId,
                name:comm.name,
                link:comm.link,
                location:comm.location,
                frequency:comm.frequency,
                method:comm.method,
                notes:comm.notes,
                itemArray:comm.itemArray,
                communityTypeArray:comm.communityTypeArray
              }

              setRows(rows.map((m) => (m.communityid == comm.communityid ? newdata : m)));
              setcommunityList(communityList.map((m) => (m.communityid == comm.communityid ? newdata : m)));

            }
          }
          catch(error){
            console.log(error)
          }
          
        

        }
      } catch (error) {
        console.error(error);
        alert("Failed to update method");
      }
    } 
    else {
      try {
        const response = await fetch(`/api/community/create/`, {
          method: "POST",
          body: JSON.stringify({
            councilId: councilId,
            name:comm.name,
            link:comm.link,
            location:comm.location,
            frequency:comm.frequency,
            method:comm.method,
            notes:comm.notes
          } as CreateRequestInput),
        });
        const data: CreateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to create method ");
        } else {
          console.log("Success")
          const community_id = data.communityId
          const community_item_map = comm.itemArray.map((item)=>{
            return {
              communityId:community_id,
              itemId:item.itemId
            }
          })
          const community_type_map = comm.communityTypeArray.map((type)=>{
            return{
              communityId:community_id,
              communitytypeId:type.communitytypeId
            }
          })
          // let community_item_map: { communityId: number; itemId: number; }[] = []
          // comm.itemArray.forEach((item)=>{
          //   community_item_map.push({
          //     communityId:community_id,
          //     itemId:item.itemId
          //   })
          // })
          // let community_type_map: { communityId: number; communitytypeId: number; }[]=[]
          // comm.communityTypeArray.forEach((type)=>{
          //   community_type_map.push({
          //     communityId:community_id,
          //     communitytypeId:type.communitytypeId
          //   })
          // })
          //item_map start

          try{
              const response = await fetch(`/api/community_item/create/`, {
                method: "POST",
                body: JSON.stringify({
                  community_item_map:community_item_map
                } as CreateRequestInputCommItem),
              });
              const dataItem: CreateResponseData = await response.json();
              if ("error" in data) {
                console.error(data.error);
                alert("Failed to create method ");
              } else {
                console.log(dataItem)
              }
            
          }catch(error){
            console.log(error)
          }
          
          // community_item_map.forEach(async (commitem)=>{
          //   try{
          //     const response = await fetch(`/api/community_item/create/`, {
          //       method: "POST",
          //       body: JSON.stringify({
          //         communityId:commitem.communityId,
          //         itemId: commitem.itemId
          //       } as CreateRequestInputCommItem),
          //     });
          //     const dataItem: CreateResponseData = await response.json();
          //     if ("error" in data) {
          //       console.error(data.error);
          //       alert("Failed to create method ");
          //     } else {
          //       console.log(dataItem)
          //     }
          //   }
          //   catch(error){
          //     console.log("Error in Item")
          //   }
          // })
          //item_map end

          try{
            const response = await fetch(`/api/community_communityType/create/`, {
              method: "POST",
              body: JSON.stringify({
                community_type_map:community_type_map
              } as CreateRequestInputCommType),
            });
            const dataItem: CreateResponseData = await response.json();
            if ("error" in data) {
              console.error(data.error);
              alert("Failed to create method ");
            } else {
              console.log(dataItem)
            }
          
         }catch(error){
          console.log(error)
          }

          //type_map start
          // community_type_map.forEach(async (commtype)=>{
          //   try{
          //     const response = await fetch(`/api/community_communityType/create/`, {
          //       method: "POST",
          //       body: JSON.stringify({
          //         communityId:commtype.communityId,
          //         communitytypeId: commtype.communitytypeId
          //       } as CreateRequestInputCommType),
          //     });
          //     const dataType: CreateResponseData = await response.json();
          //     if ("error" in data) {
          //       console.error(data.error);
          //       alert("Failed to create method ");
          //     } else {
          //       console.log(dataType)
          //     }
          //   }
          //   catch(error){
          //     console.log("Error in Type")
          //   }
          // })
          //type_map end

          const newdata = {
            communityid:community_id,
            councilid:councilId,
            name:comm.name,
            link:comm.link,
            location:comm.location,
            frequency:comm.frequency,
            method:comm.method,
            notes:comm.notes,
            itemArray:comm.itemArray,
            communityTypeArray:comm.communityTypeArray
          }

          setRows([newdata, ...rows]);
          setcommunityList([newdata, ...communityList]);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to create method");
      }
     }

    setOpenModal(false);
    setloading(false)
  };

  // action buttons
  const onCreate = () => {
    setFormInitValue({ link:"",
    notes:"",
    location:"",
    method:"",
    name:"",
    itemArray:ItemArray,
    communityTypeArray:CommunityTypeArray,
    frequency:"" });
    setMode("Create");
    setOpenModal(true);
    seterrorObj({
      errorname:false,
      errorlocation:false,
      errormethod:false,
      errortype:false,
      erroritem:false,
      errorlocregex:false
    })
  };

  const onEdit = (CD: communityDisplayData) => {
    setFormInitValue(CD);
    setMode("Edit");
    setOpenModal(true);
    seterrorObj({
      errorname:false,
      errorlocation:false,
      errormethod:false,
      errortype:false,
      erroritem:false,
      errorlocregex:false
    })
  };

  const onDelete = async (CD: communityDisplayData) => {
    if (
      confirm(
        `Are you sure you want to delete collection method "${CD.name}?"`,
      )
    ) {
      try {
        const response = await fetch(`/api/community_item/delete/`, {
          method: "DELETE",
          body: JSON.stringify({
            communityId: CD.communityid,
          }),
        });
        const data_item: CreateResponseData = await response.json();
        if ("error" in data_item) {
          console.error(data_item.error);
          alert("Failed to delete Community Item");
        }
        else{
          try {
            const response = await fetch(`/api/community_communityType/delete/`, {
              method: "DELETE",
              body: JSON.stringify({
                communityId: CD.communityid,
              }),
            });
            const data_type: CreateResponseData = await response.json();
            if ("error" in data_type) {
              console.error(data_type.error);
              alert("Failed to delete Community Type");
            }
            else{
              try {
                const response = await fetch(`/api/community/delete/`, {
                  method: "DELETE",
                  body: JSON.stringify({
                    communityId: CD.communityid,
                  }),
                });
                const data: CreateResponseData = await response.json();
                if ("error" in data) {
                  console.error(data.error);
                  alert("Failed to delete Community");
                }
                else{
                  setRows(rows.filter((m) => m.communityid != CD.communityid));
                  setcommunityList(communityList.filter((m) => m.communityid != CD.communityid))
                }
              }
              catch(error){
                console.log(error)
              }

            }
          }
          catch(error){
            console.log(error)
          }
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete Community Item");
      }
    }
  };

  const jsonSafeParse = (str: any[]) => {
    try {
      if (Array.isArray(str)) {
        return str;
      } else {
        return [str];
      }
    } catch (error) {
      return [str];
    }
  };


  return (
    <Layout user={user}>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <header className="flex flex-col items-center justify-between">
            <h6 className="text-2xl">Community Schemes</h6>
          </header>
          <div className="p-2">
            <Button onClick={onCreate}>Create New Community Scheme</Button>
          </div>

          {user.role === "SUPERADMIN" &&
            <Autocomplete
              fullWidth={true}
              className="w-full max-w-xl"
              options={council}
              placeholder=""
              //defaultValue={council[0]}
              value={council.find((c)=>c.id == councilId)}
              onChange={(_, value) => {
                if (value) {
                  setRows(communityList.filter((m) => m.councilid === value.id));
                  setcouncilId(value.id)
                  localStorage.setItem("communityselectedCouncil",value.id.toString())
                }
              }}

              // disabled={mode == "Edit"}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} autoFocus={true} label="Council Selected" />
              )}
            />}
          <CommunityForm
            open={openModal}
            mode={mode}
            formData={formInitValue}
            setFormData={setFormInitValue}
            onCancel={onFormConcel}
            onConfirm={onFormConfirm}
            errorObj={errorObj}
            seterrorObj={seterrorObj}
            loading={loading}
            setloading={setloading}
          />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size={dense ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell key={headCell.id}>
                      <TableSortLabel
                        // active={orderBy === headCell.id}
                        // direction={orderBy === headCell.id ? order : "asc"}
                        // onClick={() => onHeaderCellClick(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="row"
                      tabIndex={-1}
                      key={row.communityid}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.link}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.frequency}</TableCell>
                      <TableCell>{row.method}</TableCell>
                      <TableCell>{row.notes}</TableCell>
                      <TableCell>
                      {jsonSafeParse(row.itemArray).map((c, i) => (
                      <li key={i}>{c.itemName}</li>
                         ))}
                      </TableCell>
                      <TableCell style={{"padding":"inherit"}}>
                      {jsonSafeParse(row.communityTypeArray).map((c, i) => (
                      <li key={i}>{c.name}</li>
                         ))}
                      </TableCell>
                      <TableCell className="">
                        <Button
                          onClick={(_) => {
                            onEdit(row);
                          }}
                        >
                          Edit
                        </Button> 
                        <Button
                          onClick={async (e) => {
                            e.preventDefault();
                            onDelete(row);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            colSpan={3}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: {
                "aria-label": "rows per page",
              },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </Layout>
  );
}
