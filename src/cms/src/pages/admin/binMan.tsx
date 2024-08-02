"use client";

import React, { useState, useEffect } from "react";
import prisma from "../../utils/prisma";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { UserRole } from "@prisma/client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import {
  Card,
  Button,
  Grid,
  FormControl,
  TextField,
  Dialog,
  DialogTitle,
  Autocomplete,
  DialogActions,
} from "@mui/material";

import type {
  ResponseData as UpdateResponseData,
  RequestInput as UpdateRequestInput,
} from "../api/binMan/update";
import type {
  ResponseData as CreateResponseData,
  RequestInput as CreateRequestInput,
} from "../api/binMan/create";

import { getUserFromDb } from "../../utils/requireAuth";
import Layout from "../../components/admin/layout";

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

  const bins = await prisma.bin.findMany({
    where: {
      // councilId: user.councilId,
    },
  });

  const council = await prisma.council.findMany({
    orderBy:{
      name:'asc'
    }
  });

  return {
    props: {
      bins,
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

type Bins = InferGetServerSidePropsType<
  typeof getServerSideProps
>["bins"][number];
type FormBin = Pick<
  Bins,
  "colorCode" | "type" | "image" | "can" | "cannot" | "councilId" |"bintypeId"
> & {
  id?: number;
};
type BinFormProps = {
  open: boolean;
  mode: "Create" | "Edit";
  onCancel: () => void;
  onConfirm: (method: FormBin, mode: "Create" | "Edit") => void;
  formData: FormBin;
  setFormData: React.Dispatch<FormBin>;
};

type MethodColumn = keyof Bins;

interface HeadCell {
  id: MethodColumn;
  label: string;
}

const headCells: readonly HeadCell[] = [
  { id: "type", label: "Bin Type" },
  { id: "colorCode", label: "Bin Color" },
 // { id: "image", label: "Image" },
  { id: "can", label: "Can" },
  { id: "cannot", label: "Cannot" },
];

const BinsForm: React.FC<BinFormProps> = ({
  onCancel,
  open,
  mode,
  onConfirm,
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
      onConfirm(formData, mode);
    }
  };
  // const binTypes = [
  //   { label: "General Waste Bin", type: "General-Waste-Bin" },
  //   { label: "Recycling Bin", type: "Recycling-Bin" },
  //   { label: "Green Waste Bin", type: "Green-Waste-Bin" },
  //   { label: "Food Waste Bin", type: "Food-Waste-Bin" },
  // ];

  interface BinType {
    bintypeid: number;
    label: string;
    type: string;
  }
  const [binTypes, setBinTypes] = useState<BinType[]>([]);
  //const binTypes: { bintypeid: number; label: string,type: string }[] = []
  useEffect(()=>{
    const tempbintypes: { bintypeid: number; label: string; type: string }[] = [];
    const NewBinTypes = async () =>{
      const response = await fetch(`/api/binType/`,{
            method:"GET"
           })
      await response.json().then((val)=>{
          val.forEach((ele: { bintypeid: number; binType: string; }) => {
              tempbintypes.push({
              bintypeid : ele.bintypeid,
              label : ele.binType,
              type : ele.binType.split(" ").join("-")
            })
          });
    })
  }
  NewBinTypes()
  setBinTypes(tempbintypes)
},[])

  return (
    <Dialog disablePortal open={open} onClose={onCancel} fullWidth={true}>
      <form className="p-5">
        <DialogTitle>{mode} Item</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                fullWidth={true}
                className="w-full max-w-xl"
                options={binTypes}
                placeholder=""
                defaultValue={ binTypes.find((type) => type.type === formData.type)
                }
                onChange={(_, value) =>
                  value &&
                  formData &&
                  setFormData({ ...formData, type: value.type, bintypeId: value.bintypeid })
                }
                disabled={mode == "Edit"}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} autoFocus={true} label="Bin Type" />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="colorCode"
              label="Bin Color"
              variant="outlined"
              multiline
              minRows={1}
              fullWidth
              value={formData?.colorCode}
              onChange={(e) => {
                formData &&
                  setFormData({
                    ...formData,
                    colorCode: e.target.value.trim(),
                  });
              }}
            />
          </Grid>

          {/* <Grid item xs={12}>
            <TextField
              name="Image"
              label="Image"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={formData?.image}
              onChange={(e) => {
                e.preventDefault();
                formData &&
                  setFormData({ ...formData, image: e.target.value.trim() });
              }}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              name="Can"
              label="Can"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={formData?.can}
              placeholder='["Ford", "BMW", "Fiat"]'
              onChange={(e) => {
                e.preventDefault();
                formData &&
                  setFormData({ ...formData, can: e.target.value.trim() });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="Cannot"
              label="Cannot"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={formData?.cannot}
              placeholder='["Ford", "BMW", "Fiat"]'
              onChange={(e) => {
                e.preventDefault();
                formData &&
                  setFormData({ ...formData, cannot: e.target.value.trim() });
              }}
            />
          </Grid>
          <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Confirm</Button>
          </DialogActions>
        </Grid>
      </form>
    </Dialog>
  );
};

export default function BinMan({
  bins,
  user,
  council,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  type bins = (typeof bins)[number];
  const [councilId, setcouncilId] = useState(user.councilId);
  const [binList, setBinList] = useState<bins[]>(bins);

  //table
  const [rows, setRows] = useState<Bins[]>(
    binList.filter((m) => m.councilId === councilId),
  );

  useEffect(() => {
    // Check if the selected council is present in the query parameters
    if(user.role=="SUPERADMIN")
    {
    let selectedcouncil  = localStorage.getItem('binManselectedCouncil');
    if (selectedcouncil) {
      let newselectedcouncil = parseInt(selectedcouncil)
      setcouncilId(newselectedcouncil)
      setRows(binList.filter((m) => m.councilId === newselectedcouncil));
    } 
  }
  }, [councilId]);

  // const defaultBin: FormBin = {
  //   colorCode: "",
  //   type: "",
  //   image: "",
  //   can: "",
  //   cannot: "",
  //   councilId: user.councilId,
  //   bintypeId:1
  // };
  type FormMode = "Create" | "Edit";
  const [formMode, setformMode] = useState<FormMode>("Create");
  const [openModal, setOpenModal] = useState(false);
  const [formInitValue, setFormInitValue] = useState<FormBin>({
    colorCode: "",
    type: "General-Waste-Bin",
    image: "",
    can: "",
    cannot: "",
    councilId: user.councilId,
    bintypeId:1
  });
  // commenting for build
  // const [showForm, setShowForm] = useState<boolean>(false);
  // const [newBin, setNewBin] = useState<FormBin>({ ...defaultBin });
  // const [binList, setBinList] = useState<bins[]>(bins);

  const onFormConcel = () => setOpenModal(false);
  const onFormConfirm = async (bin: FormBin, mode: FormMode) => {
    if (mode == "Edit") {
      try {
        const response = await fetch(`/api/binMan/update/`, {
          method: "POST",
          body: JSON.stringify({
            id: bin.id,
            colorCode: bin.colorCode,
            type: bin.type,
            image: bin.image,
            can: bin.can,
            cannot: bin.cannot,
            councilId: councilId,
            bintypeId:bin.bintypeId
          } as UpdateRequestInput),
        });
        const data: UpdateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to update Bin");
        } else {
          setRows(rows.map((m) => (m.id == bin.id ? data : m)));
          setBinList(binList.map((m) => (m.id == bin.id ? data : m)));
        }
      } catch (error) {
        console.error(error);
        alert("Failed to update Bin");
      }
    } else {
      try {
        const response = await fetch(`/api/binMan/create`, {
          method: "POST",
          body: JSON.stringify({
            colorCode: bin.colorCode,
            type: bin.type,
            image: bin.image,
            can: bin.can,
            cannot: bin.cannot,
            councilId: councilId,
            bintypeId:bin.bintypeId
          } as CreateRequestInput),
        });
        const data: CreateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to create Bin");
        } else {
          setBinList([data, ...binList]);
          setRows([data, ...rows]);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to create Bin");
      }
    }

    setOpenModal(false);
  };

  const onCreate = () => {
    setformMode("Create");
    setFormInitValue({
      colorCode: "",
      type: "General-Waste-Bin",
      image: "",
      can: "",
      cannot: "",
      councilId: councilId,
      bintypeId:1
    });
    setOpenModal(true);
  };

  const onEdit = (m: Bins) => {
    setformMode("Edit"); 
    setFormInitValue(m);
    setOpenModal(true);
  };

  const onDelete = async (item: Bins) => {
    if (confirm(`Are you sure you want to delete "${item.colorCode} bin?"`)) {
      try {
        const response = await fetch(`/api/binMan/delete/`, {
          method: "DELETE",
          body: JSON.stringify({
            id: item.id,
          }),
        });
        const data: CreateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to delete bin");
        } else {
          setBinList(binList.filter((m) => m.id != item.id));
          setRows(rows.filter((m) => m.id != item.id));
        }
      } catch (error) {
        console.error(error);
        alert("Failed to delete bin");
      }
    }
  };
  const jsonSafeParse = (str: string) => {
    try {
      const ans = Array.from(JSON.parse(str)) as string[];
      if (Array.isArray(ans)) {
        return ans;
      } else {
        return [str];
      }
    } catch (error) {
      return [str];
    }
  };

  return (
    <Layout user={user}>
      <Card className="rounded-md p-5">
        <header className="flex flex-col items-center justify-between">
          <h6 className="text-2xl">Bin Management</h6>
        </header>
        <Button onClick={onCreate}>Create New Bin</Button>
        {user.role === "SUPERADMIN" && (
          <Autocomplete
            fullWidth={true}
            className="w-full max-w-xl"
            options={council}
            placeholder=""
            //defaultValue={council[0]}
            value={council.find((c)=>c.id == councilId)}
            onChange={(_, value) => {
              if (value) {
                setRows(binList.filter((m) => m.councilId === value.id));
                setcouncilId(value.id);
                localStorage.setItem("binManselectedCouncil",value.id.toString())
              }
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus={true}
                label="Council Selected"
              />
            )}
          />
        )}

        <BinsForm
          open={openModal}
          mode={formMode}
          formData={formInitValue}
          setFormData={setFormInitValue}
          onCancel={onFormConcel}
          onConfirm={onFormConfirm}
        />

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}>{headCell.label}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.type.replace(/-/g, " ")}
                  </TableCell>
                  <TableCell component="th" scope="row" align="left">
                    {row.colorCode}
                  </TableCell>
                  {/* <TableCell style={{ width: 160 }} align="left">
                    {row.image}
                  </TableCell> */}
                  <TableCell style={{ width: 300 }} align="left">
                    {jsonSafeParse(row.can).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </TableCell>
                  <TableCell style={{ width: 200 }} align="left">
                    {jsonSafeParse(row.cannot).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
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
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Layout>
  );
}
