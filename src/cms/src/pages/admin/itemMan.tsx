import React, { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Grid,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  Autocomplete,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getUserFromDb } from "../../utils/requireAuth";

import prisma from "../../utils/prisma";
import type {
  ResponseData as UpdateResponseData,
  RequestInput as UpdateRequestInput,
} from "../api/itemMan/update";
import type {
  ResponseData as CreateResponseData,
  RequestInput as CreateRequestInput,
} from "../api/itemMan/create";
import Layout from "../../components/admin/layout";
import { supabase } from "../../utils/supabaseClient";
import { StorageError } from "@supabase/storage-js";
import { string } from "prop-types";

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

  if ("error" in user || user.role !== "SUPERADMIN" || !user.councilId) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const items = await prisma.item.findMany({
    where: {},
    include: {
      subCategory: {
        select: {
          name: true,
          PrimaryMaterial: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  

  const subCategory = await prisma.subCategory.findMany({
    where: {
    },
    include: {
      PrimaryMaterial: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return {
    props: { items, subCategory, user },
  };
};

type Items = InferGetServerSidePropsType<
  typeof getServerSideProps
>["items"][number];
type SubCategory = InferGetServerSidePropsType<
  typeof getServerSideProps
>["subCategory"];
type FormItem = Pick<Items, "name" | "code" | "subCategoryId" | "image"| "itemDBImg"> & {
  id?: number;
};

type MethodColumn = keyof Items;
type Order = "asc" | "desc";

interface HeadCell {
  id: MethodColumn;
  label: string;
}

const headCells: readonly HeadCell[] = [
  { id: "id", label: "ID" },
  { id: "name", label: "name" },
];

type ItemsFormProps = {
  open: boolean;
  subCategorys: SubCategory;
  mode: "Create" | "Edit";
  itemImage : File | undefined;
  onCancel: () => void;
  onConfirm: (method: FormItem,imageFile : File | undefined, mode: "Create" | "Edit") => void;
  onSingleItemEdit: (item: FormItem,imageFile : File | undefined) => Promise<boolean>;
  formData: FormItem;
  setFormData: React.Dispatch<FormItem>;
};




const ItemsForm: React.FC<ItemsFormProps> = ({
  onCancel,
  open,
  mode,
  itemImage,
  subCategorys,
  onConfirm,
  onSingleItemEdit,
  formData,
  setFormData,
}) => {
  const handleSubmit = async (e: unknown) => {
    // @ts-ignore
    e.preventDefault();
    if (!formData) {
      alert("error, no form data");
      return;
    } else {
      onConfirm(formData,itemImage, mode);
    }
  };

  function clearImage(): void {
    itemImage = undefined;
  }

 async function DeleteImage(itemName :string| undefined,item: FormItem) {
  //Adding comments for build
    if(confirm("Do you want to upload new file ? ")){
       if(itemName){
                let pathList = [];
                pathList.push(itemName);
                
                const {
                    data,
                    error,
                  } =
                  await supabase.storage.from("item_image").remove(pathList);
                  
                  if(error){
                    alert(error);
                  }

                  item.itemDBImg = null;
                  item.image = null;
                  onSingleItemEdit(item,undefined);
                  onCancel();
                  alert("File succesfully deleted !")
            
              }
      }
  }

  return (
    <Dialog disablePortal open={open} onClose={onCancel} fullWidth={true}>
      <form className="p-5">
        <DialogTitle>{mode} Item</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="Item name"
              label="Item name"
              variant="outlined"
              multiline
              minRows={1}
              fullWidth
              value={formData?.name}
              disabled={mode == "Edit"}
              onChange={(e) => {
                formData && setFormData({ ...formData, name: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                fullWidth={true}
                className="w-full max-w-xl"
                options={subCategorys ?? []}
                placeholder=""
                defaultValue={subCategorys.find(
                  (subCategorys) => subCategorys.id == formData?.subCategoryId,
                )}
                groupBy={(option) => option.PrimaryMaterial.name}
                onChange={(_, value) =>
                  value &&
                  formData &&
                  setFormData({ ...formData, subCategoryId: value.id })
                }
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} autoFocus={true} label="subCategory" />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
          <div>
                            <input
                                type="file"
                                name="myImage"
                                onChange={(event) => {
                                  if(formData.image){
                                    alert("Warning: Please remove exsisting image first and add again !!")
                                  }
                                  if(event.target.files){
                                    //itemImage = URL.createObjectURL(event.target.files[0]); 
                                    itemImage = event.target.files[0];
                                  }
                                }
                            } /> </div>
                            <br />
                        
                          {mode == "Edit" && formData?.itemDBImg && (
                           <div> <img
                                alt="not found"
                                width={"150px"}
                                height={"150px"}
                                src={formData?.itemDBImg?.toString()}
                            />

                            <br />
                         <Button variant="outlined"  onClick={() => DeleteImage(formData?.image?.toString(),formData) } >Remove from db</Button>
     
                         </div>
                        )}
                   
          </Grid>
        </Grid>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default function ItemManagement({
  items,
  subCategory,
  user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  type items = (typeof items)[number];

  items.forEach(i => {
    if(i?.image){
    const imageData = supabase.storage.from("item_image").getPublicUrl(i?.image);
    if(imageData){
        i.itemDBImg = imageData.data.publicUrl;
    }
  }
  });

  //table
  const [itemList, setitemList] = useState<Items[]>(items);

  const [rows, setRows] = useState(itemList);

  //pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  //Form

  type FormMode = "Create" | "Edit";
  const [formMode, setformMode] = useState<FormMode>("Create");
  const [openModal, setOpenModal] = useState(false);
  const [formInitValue, setFormInitValue] = useState<FormItem>({
    name: "",
    subCategoryId: 1,
    code: "",
    image:null,
    itemDBImg :null
  });


  const onFormConcel = () => setOpenModal(false);
    
    

  const  saveImageFile =async (itemName:string,itemImage:File | undefined,mode: FormMode) : Promise<Boolean> =>{
         // Image saving part
         if(itemImage){

          const {
            data,
            error,
          }: { data: { path: string } | null; error: StorageError | null } =
            //  (mode == "Edit") ?
            // await supabase.storage.from("item_image").update(`${itemName+"_"+itemImage?.name}`, itemImage) 
            // :
            await supabase.storage.from("item_image").upload(`${itemName+"_"+itemImage?.name}`, itemImage);
        

        if (error) {
          // if(error.statusCode === "409"){
          //     console.log(error);
          //     alert("File update error : Same file exists.");
          //     return false;
          // }else{
            alert("File update error");
            return false;
          //}
        }else{
          return true;
        }
      }else{
        return true;
      }

      return false;

  }


 async function updateItem(item: FormItem,imageFile : File | undefined) : Promise<boolean> {
    try {
      debugger;
      const response = await fetch(`/api/itemMan/update/`, {
        method: "POST",
        body: JSON.stringify({
          id: item.id,
          name: item.name,
          subCategoryId: item.subCategoryId,
          code: item.code,
          image: (imageFile)? item.name+"_"+imageFile?.name : (item.image) ? item.image : "",
        } as UpdateRequestInput),
      });
      const data: UpdateResponseData = await response.json();
      if ("error" in data) {
        console.error(data.error);
        alert("Failed to update Item");
        return false;
      } else {
        if(data.image){
        const imageData = supabase.storage.from("item_image").getPublicUrl(data.image);
        if(imageData){
          data.itemDBImg  = imageData.data.publicUrl;
        }
      }
        setRows(rows.map((m) => (m.id == item.id ? data : m)));
        return true;
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update Item");
      return false;
    }
  }
  

  const onFormConfirm = async (item: FormItem,imageFile :File | undefined, mode: FormMode) => {

    saveImageFile(item.name,imageFile,mode).then(val=>{
      if(!val){
        alert("Failed to save item details");
        return;
      }else{
    if (mode == "Edit") {
        updateItem(item,imageFile);
    } else {
            try {
              const response = fetch(`/api/itemMan/create/`, {
                method: "POST",
                body: JSON.stringify({
                  name: item.name,
                  subCategoryId: item.subCategoryId,
                  code: item.code,
                  image: (imageFile)? item.name+"_"+imageFile?.name : "",
                } as CreateRequestInput),
              });
               response.then(res =>{
                if ("error" in res) {
                  console.error(res.error);
                  alert("Failed to update method");
                } else {
                   res.json().then(r=>{
                    const imageData = supabase.storage.from("item_image").getPublicUrl(r.image);
                    if(imageData){
                      r.itemDBImg  = imageData.data.publicUrl;
                    }
                    setRows([r, ...rows]);
                  });
                  
                }
              });
              
            } catch (error) {
              console.error(error);
              alert("Failed to update method");
            }
      }
      //commenting for build-1
      //RefreshItem(item?.id,imageName);
      onFormConcel();
    }
  });
      
  };

  // Action Button
  const onCreate = () => {
    setformMode("Create");
    formInitValue.code = "";
    formInitValue.image = null;
    formInitValue.name = "";
    formInitValue.id = 0;
    setFormInitValue(formInitValue);
    setOpenModal(true);
  };


  const onEdit = (m: Items) => {
    debugger;
    setformMode("Edit");
    setFormInitValue(m);
    
    setOpenModal(true);
  };

  const onDelete = async (item: Items) => {
    if (confirm(`Are you sure you want to delete  "${item.name}?"`)) {
      try {
        const response = await fetch(`/api/itemMan/delete/`, {
          method: "DELETE",
          body: JSON.stringify({
            id: item.id,
          }),
        });
        const data: CreateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to delete item 1");
        } else {
          setRows(rows.filter((m) => m.id != item.id));
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete item");
      }
    }
  };

  async function RefreshItem(itemId:number|undefined,image:string | undefined) {
    debugger;
      if(image){
        items.find((i) => i.id == itemId)!.image = image;
        const imageData = supabase.storage.from("item_image").getPublicUrl(image);
        if(imageData){
          items.find((i) => i.id == itemId)!.itemDBImg = imageData.data.publicUrl;
      }
    }
 }

  // sorting
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<MethodColumn>("name");
  const onHeaderCellClick = (property: MethodColumn) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
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

  return (
    <Layout user={user}>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <header className="flex flex-col items-center justify-between">
            <h6 className="text-2xl">Item Management</h6>
          </header>
          <div className="p-2">
            <Button onClick={onCreate}>
              <AddIcon />
              Create
            </Button>
            {/*
            <Button component="label" startIcon={<FileUploadIcon />}>
              CSV
              <form>
                <input accept=".csv" hidden type="file" onChange={onUpload} />
              </form>
            </Button>
            */}
            <Autocomplete
              fullWidth={true}
              className="w-full max-w-xl"
              options={items}
              placeholder=""
              onChange={(_, value) => {
                if (value) {
                  setRows(itemList.filter((m) => m.id === value?.id));
                } else {
                  
                  setRows(itemList);
                }
              }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} autoFocus={true} label="Search Bar" />
              )}
            />
          </div>
          <ItemsForm
            open={openModal}
            mode={formMode}
            subCategorys={subCategory}
            itemImage={undefined}
            formData={formInitValue}
            setFormData={setFormInitValue}
            onCancel={onFormConcel}
            onConfirm={onFormConfirm}
            onSingleItemEdit={updateItem}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <TableHead>
                <TableRow>
                      <TableCell>Image</TableCell>
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
                  <TableCell>SubCategory</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                   
                    <img width={"100px"} height={"100px"} src={row.itemDBImg?.toString()} />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.name}
                    </TableCell>
                    {/* <TableCell style={{ width: 160 }} align="left">
                      {row.code}
                    </TableCell> */}
                    <TableCell style={{ width: 160 }} align="left">
                      {row.subCategory?.name}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      {row.subCategory?.PrimaryMaterial.name}
                    </TableCell>
                    <TableCell className="">
                      <Button
                        onClick={() => {
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
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 50, 100, { label: "All", value: -1 }]}
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
      </Box>
    </Layout>
  );
}




