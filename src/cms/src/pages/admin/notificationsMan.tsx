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
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
  } from "@mui/material";
  
  import type {
    ResponseData as UpdateResponseData,
    RequestInput as UpdateRequestInput,
  } from "../api/notifications/update";
  import type {
    ResponseData as CreateResponseData,
    RequestInput as CreateRequestInput,
  } from "../api/notifications/create";
  import prisma from "../../utils/prisma";
  import { fetchItemsFromAPI, type CachedItems } from "../../utils/cacahedData";
  import { getUserFromDb } from "../../utils/requireAuth";
  import Layout from "../../components/admin/layout";
import { Council } from "@prisma/client";
import councilChange from "../api/auth/changeCouncil";
import { useRouter } from "next/router";
  
  
  
  
  
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
  
    if ("error" in user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN") || !user.councilId) {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
  
    // TODO use sql and pagination to save traffic
    const notifications = await prisma.notifications.findMany({
      
    });
  
    const council = await prisma.council.findMany({
      orderBy:{
        name:'asc'
      }
  
    })

    if(user.role=="SUPERADMIN")
    {
    const commoncouncil : Council ={
      id:999,
      name:"All Councils",
      isLiscencing:true,
      councilImage:null,
      showBinDayCalendar:true
    }
    council.unshift(commoncouncil)
  }
  
    return {
      props: { notifications, council, user },
    };
  };
  
  type Notification = {
    notificationId:number,
    heading:string,
    message:string,
    link:string|null,
    councilId:number|null
  }
  type NotificationColumn = keyof Notification;
  
  type FormNotification = Pick<Notification, "heading" | "message" | "link" | "councilId"> & { notificationId?: number };
  type NotificationFormProps = {
    open: boolean;
    mode: "Create" | "Edit";
    onCancel: () => void;
    onConfirm: (method: FormNotification, mode: "Create" | "Edit") => void;
    formData: FormNotification;
    setFormData: React.Dispatch<FormNotification>;
    errorObj:any;
    seterrorObj:React.Dispatch<any>;
    linktype:string;
    setlinktype:React.Dispatch<any>;
    checkbox:boolean;
    setcheckbox:React.Dispatch<any>;
    user:any;
    councilnamemap:any[];
    councilform:any;
    setcouncilform:React.Dispatch<any>;

  };
  
  const NotificationForm: React.FC<NotificationFormProps> = ({
    onCancel,
    open,
    mode,
    onConfirm,
    formData,
    setFormData,
    errorObj,
    seterrorObj,
    linktype,
    setlinktype,
    checkbox,
    setcheckbox,
    user,
    councilnamemap,
    councilform,
    setcouncilform
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

    let regexp : RegExp = /^https:\/\//;
    const validateinput = (field:string,value:any) =>{
      if(field=="errorheading" && value=="")
      {
        errorObj.errorheading=false
      }
      else if(field=="errorheading" && value!=""){
        const svalue = value.split(" ")
        if(svalue.length && svalue.length>5){
          errorObj.errorheading=true
        }
        else
        {
        errorObj.errorheading=false
        }
      }
      if(field=="errormessage" && value=="")
      {
        errorObj.errormessage=true
      }
      else if(field=="errormessage" && value!=""){
        const svalue = value.split(" ")
        if(svalue.length && svalue.length>15){
          errorObj.errormessage=true
        }
        else
        {
        errorObj.errormessage=false
        }
      }
      if(field=="errorlink" && value!=""){
        if(regexp.test(value)) // on success
        {
          
          errorObj.errorlink=false
        }
        else{ // on failure
          errorObj.errorlink=true
        }
      }
      else if (field=="errorlink" && value==""){
        errorObj.errorlink=false
      }
    }

    const setlink  = (formData:any,value:string|null,council:string|null) => {
     // console.log(process.env.NODE_ENV)
     const currentlink = window.location.href
     console.log(currentlink)
     if(currentlink.includes("cms-git-preview"))
     {
      if (value=="home"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/"})
        }
        else
        {
        setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/"+"?council="+council})
        }
      }
      else if(value=="homerecycling"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/homerecycling"})
        }
        else
        {
        setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/homerecycling"+"?council="+council})
        }
        
      }
      else if(value=="binDay"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/binDay"})
        }
        else
        {
        setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/binDay"+"?council="+council})
        }
      }
      else if(value=="mapp"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/mapp"})
        }
        else
        {
        setFormData({...formData,link:"https://frontend-git-preview-binfluence.vercel.app/mapp"+"?council="+council})
        }
      }
     }
     else
     {
      if (value=="home"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://www.binfluence.com.au/"})
        }
        else
        {
        setFormData({...formData,link:"https://www.binfluence.com.au/"+"?council="+council})
        }
      }
      else if(value=="homerecycling"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://www.binfluence.com.au/homerecycling"})
        }
        else
        {
        setFormData({...formData,link:"https://www.binfluence.com.au/homerecycling"+"?council="+council})
        }
        
      }
      else if(value=="binDay"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://www.binfluence.com.au/binDay"})
        }
        else
        {
        setFormData({...formData,link:"https://www.binfluence.com.au/binDay"+"?council="+council})
        }
      }
      else if(value=="mapp"){
        if(council!=null && council=="")
        {
          setFormData({...formData,link:"https://www.binfluence.com.au/mapp"})
        }
        else
        {
        setFormData({...formData,link:"https://www.binfluence.com.au/mapp"+"?council="+council})
        }
      }
     }

    }

  
    return (
      <Dialog disablePortal open={open} onClose={onCancel} fullWidth={true}>
        <form className="p-5">
          <DialogTitle>{mode} Notification</DialogTitle>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="heading"
                label="Heading"
                variant="outlined"
                multiline
                minRows={1}
                fullWidth
                value={formData?.heading}
                onChange={(e) => {
                  formData &&
                    setFormData({ ...formData, heading: e.target.value });
                    validateinput("errorheading",e.target.value)
                }}
                onBlur={(e)=>{
                  validateinput("errorheading",e.target.value)
                }}
              />
               <p style={{color:"red"}}>{errorObj.errorheading?"Note: Heading should be not more than 5 words":""}</p>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="message"
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                minRows={5}
                value={formData?.message}
                onChange={(e) => {
                  e.preventDefault();
                  formData &&
                    setFormData({ ...formData, message: e.target.value });
                    validateinput("errormessage",e.target.value)
                }}
                onBlur={(e)=>{
                  validateinput("errormessage",e.target.value)
                }}
              />
              <p style={{color:"red"}}>{errorObj.errormessage?"Note: Message should not be empty and must not be more then 15 words":""}</p>
            </Grid>
            <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-label">Link*</InputLabel>
              <Select
                id="demo-simple-select"
                label="Age"
                minRows={3}
                value={linktype}
                disabled={checkbox}
                required
                onChange={(e) => {
                  setlink(formData,e.target.value,councilform.label)
                  setlinktype(e.target.value)
                }}
              >
                <MenuItem value={"home"}>Home</MenuItem>
                <MenuItem value={"homerecycling"}>My council</MenuItem>
                <MenuItem value={"binDay"}>Bin days and collections</MenuItem>
                <MenuItem value={"mapp"}>Community schemes</MenuItem>
              </Select>
              </FormControl>
        </Grid>
        <Grid item xs={12}>
        {user.role === "SUPERADMIN" && formData.councilId===999 &&
              <Autocomplete
                fullWidth={true}
                className="w-full max-w-xl"
                options={councilnamemap}
                disabled={checkbox}
                value={councilform}
                onChange={(_, value) => {
                  if (value) {
                    console.log(value)
                    setlink(formData,linktype,value.label)
                    setcouncilform(value)
                  }
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} autoFocus={true} label="Council Selected" />
                )}
              />}
        </Grid>
        <Grid item xs={12}>
        <FormControlLabel onChange={(e,checked)=>{
          if(checked){
            setcheckbox(true)
            setcouncilform({label:""})
            setlinktype("")
          }
          else
          {
            setcheckbox(false)
            setcouncilform({label:""})
            setlinktype("")
          }
        }}control={<Checkbox />} checked={checkbox} label="Select checkbox to enter external website" />
        </Grid>
            <Grid item xs={12}>
              <TextField
                name="link"
                label="Link/website"
                variant="outlined"
                fullWidth
                multiline
                minRows={1}
                value={formData?.link}
                disabled={!checkbox}
                onChange={(e) => {
                  e.preventDefault();
                  formData &&
                    setFormData({ ...formData, link: e.target.value.trim() });
                    validateinput("errorlink",e.target.value)
                }}
              />
              <p style={{color:"red"}}>{errorObj.errorlink?"Note: please make sure your link starts with https://":""}</p>
            </Grid>
            <DialogActions>
              <Button onClick={onCancel}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!(formData.message!="" && errorObj.errorlink==false && errorObj.errormessage==false && errorObj.errorheading==false)}>Confirm</Button>
            </DialogActions>
          </Grid>
        </form>
      </Dialog>
    );
  };
  
  type Order = "asc" | "desc";
  
  interface HeadCell {
    id: NotificationColumn;
    label: string;
  }
  
  const headCells: readonly HeadCell[] = [
    {
      id: "heading",
      label: "Heading",
    },
    { id: "message", label: "Message" },
    { id:"link",label:"Link/Website"}
  ];
  
  export default function CollectionMethods({
    notifications, council, user
  }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [councilId, setcouncilId] = useState(user.councilId)

    const councilmap = council.filter((c)=>{
      return c.id!=999
    })

    const councilnamemap = councilmap.map((c)=>{
      return {
        label:c.name,
      }
    })

    const [councilform,setcouncilform] = useState({label:""})

    const router = useRouter()
    console.log(router.pathname)
    // // rows

  
    const [methodList, setMethodList] = useState<Notification[]>(notifications);
    const [rows, setRows] = useState<Notification[]>(methodList.filter((m) => m.councilId === (councilId==999?null:councilId)));

    const [linktype,setlinktype] = useState("")
    const [checkbox,setcheckbox] = useState(false)

    const [errorObj,seterrorObj] = useState({
      errorheading:false,
      errormessage:false,
      errorlink:false
    })
  
    // // sorting
    const [order, setOrder] = useState<Order>("asc");
    const [orderBy, setOrderBy] = useState<NotificationColumn>("notificationId");
    const onHeaderCellClick = (property: NotificationColumn) => {
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
      let selectedcouncil  = localStorage.getItem('notificationsselectedcouncil');
      if (selectedcouncil) {
        let newselectedcouncil = parseInt(selectedcouncil)
        setcouncilId(newselectedcouncil)
        setRows(methodList.filter((m) => m.councilId === (newselectedcouncil==999?null:newselectedcouncil)));
      } 
    }
    }, [councilId]);
  
  
    // forms
    type FormMode = "Create" | "Edit";
    const [openModal, setOpenModal] = useState(false);
    const [formInitValue, setFormInitValue] = useState<FormNotification>({
      heading:"",
      message:"",
      link:"",
      councilId:councilId
    });
    const [mode, setMode] = useState<FormMode>("Create");
    const onFormConcel = () => setOpenModal(false);
    const onFormConfirm = async (method: FormNotification, mode: FormMode) => {
      if (mode == "Edit") {
        try {
          const response = await fetch(`/api/notifications/update/`, {
            method: "POST",
            body: JSON.stringify({
              notificationId:method.notificationId,
              heading: method.heading,
              message: method.message,
              link:method.link
            } as UpdateRequestInput),
          });
          const data: UpdateResponseData = await response.json();
          if ("error" in data) {
            console.error(data.error);
            alert("Failed to update method");
          } else {
  
            setRows(rows.map((m) => (m.notificationId == method.notificationId ? data : m)));
            setMethodList(methodList.map((m) => (m.notificationId == method.notificationId ? data : m)));
  
          }
        } catch (error) {
          console.error(error);
          alert("Failed to update method");
        }
      } else {
        try {
          const response = await fetch(`/api/notifications/create/`, {
            method: "POST",
            body: JSON.stringify({
              councilId: councilId==999?null:councilId,
              heading:method.heading,
              link:method.link,
              message:method.message
            } as CreateRequestInput),
          });
          const data: CreateResponseData = await response.json();
          if ("error" in data) {
            console.error(data.error);
            alert("Failed to create method ");
          } else {
            setRows([data, ...rows]);
            setMethodList([data, ...methodList]);
          }
        } catch (error) {
          console.error(error);
          alert("Failed to create method");
        }
      }
  
      setOpenModal(false);
    };
  
    // action buttons
    const onCreate = () => {
      setFormInitValue({ heading: "", link: "" ,message:"",councilId:councilId});
      setMode("Create");
      setOpenModal(true);
      seterrorObj({
       errorheading:false,
       errormessage:false,
       errorlink:false
      })
      setcheckbox(false)
      setlinktype("")
      setcouncilform({label:""})
    };
  
    const onEdit = (m: Notification) => {
      setFormInitValue(m);
      setMode("Edit");
      setOpenModal(true);
      seterrorObj({
        errorheading:false,
        errormessage:false,
        errorlink:false
       })
      if(m.link!=undefined && m.link!="")
      {
        if(m.link.includes("?council="))
        {
        if(m.link.includes("binDay")){
          setcheckbox(false)
          setlinktype("binDay")
          let splitarray = m.link.split("=")
          setcouncilform({label:splitarray[1]})
        }
        else if(m.link.includes("homerecycling")){
          setcheckbox(false)
          setlinktype("homerecycling")
          let splitarray = m.link.split("=")
          setcouncilform({label:splitarray[1]})
        }
        else if(m.link.includes("mapp")){
          setcheckbox(false)
          setlinktype("mapp")
          let splitarray = m.link.split("=")
          setcouncilform({label:splitarray[1]})
        }
        else{
          setcheckbox(false)
          setlinktype("home")
          let splitarray = m.link.split("=")
          setcouncilform({label:splitarray[1]})
        }
      }
      else
      {
        setcheckbox(true)
        setlinktype("")
        setcouncilform({label:""})
      }
      }
      else if(m.link!=undefined && m.link==""){
        setcheckbox(false)
        setlinktype("")
        setcouncilform({label:""})
      }
    };
  
    const onDelete = async (method: Notification) => {
      if (
        confirm(
          `Are you sure you want to delete collection method "${method.heading}?"`,
        )
      ) {
        try {
          const response = await fetch(`/api/notifications/delete/`, {
            method: "DELETE",
            body: JSON.stringify({
              notificationId: method.notificationId,
            }),
          });
          const data: CreateResponseData = await response.json();
          if ("error" in data) {
            console.error(data.error);
            alert("Failed to delete method");
          } else {
            setRows(rows.filter((m) => m.notificationId != method.notificationId));
            setMethodList(methodList.filter((m) => m.notificationId != method.notificationId))
          }
        } catch (error) {
          console.error(error);
          alert("Failed to delete method");
        }
      }
    };
  
  
    return (
      <Layout user={user}>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <header className="flex flex-col items-center justify-between">
              <h6 className="text-2xl">Notifications</h6>
            </header>
            <div className="p-2">
              <Button onClick={onCreate}>Create New Notification</Button>
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
                    if(value.id == 999)
                    {
                      const filterlist = methodList.filter((m)=>{
                        return m.councilId==null
                      })
                      setRows(filterlist)
                    }
                    else
                    {
                    setRows(methodList.filter((m) => m.councilId === value.id));
                    }
                    setcouncilId(value.id)
                    localStorage.setItem("notificationsselectedcouncil",value.id.toString())
                  }
                }}
  
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} autoFocus={true} label="Council Selected" />
                )}
              />}
            <NotificationForm
              open={openModal}
              mode={mode}
              formData={formInitValue}
              setFormData={setFormInitValue}
              onCancel={onFormConcel}
              onConfirm={onFormConfirm}
              errorObj={errorObj}
              seterrorObj={seterrorObj}
              linktype={linktype}
              setlinktype={setlinktype}
              checkbox={checkbox}
              setcheckbox={setcheckbox}
              councilform={councilform}
              setcouncilform={setcouncilform}
              councilnamemap={councilnamemap}
              user={user}
            />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} size={dense ? "small" : "medium"}>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id}>
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : "asc"}
                          onClick={() => onHeaderCellClick(headCell.id)}
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
                        key={row.notificationId}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{row.heading}</TableCell>
                        <TableCell>{row.message}</TableCell>
                        <TableCell>{row.link}</TableCell>
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
  