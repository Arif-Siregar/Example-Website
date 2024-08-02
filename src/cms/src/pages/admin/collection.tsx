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
} from "@mui/material";

import type {
  ResponseData as UpdateResponseData,
  RequestInput as UpdateRequestInput,
} from "../api/method/update";
import type {
  ResponseData as CreateResponseData,
  RequestInput as CreateRequestInput,
} from "../api/method/create";
import prisma from "../../utils/prisma";
import { fetchItemsFromAPI, type CachedItems } from "../../utils/cacahedData";
import { getUserFromDb } from "../../utils/requireAuth";
import Layout from "../../components/admin/layout";





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
  const methods = await prisma.method.findMany({
    where: {
      // councilId: user.councilId,
      binId: null,
    },
    orderBy: [
      {
        item: {
          name: "asc",
        },
      },
    ],
  });

  const council = await prisma.council.findMany({
    orderBy:{
      name:'asc'
    }

  })

  return {
    props: { methods, council, user },
  };
};

type Method = InferGetServerSidePropsType<
  typeof getServerSideProps
>["methods"][number];
type MethodColumn = keyof Method;

type FormMethod = Pick<Method, "itemId" | "method" | "note" | "address"> & { id?: number };
type MethodFormProps = {
  open: boolean;
  items: CachedItems;
  mode: "Create" | "Edit";
  onCancel: () => void;
  onConfirm: (method: FormMethod, mode: "Create" | "Edit") => void;
  formData: FormMethod;
  setFormData: React.Dispatch<FormMethod>;
};

const MethodForm: React.FC<MethodFormProps> = ({
  onCancel,
  open,
  mode,
  items,
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

  return (
    <Dialog disablePortal open={open} onClose={onCancel} fullWidth={true}>
      <form className="p-5">
        <DialogTitle>{mode} Method</DialogTitle>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                fullWidth={true}
                className="w-full max-w-xl"
                options={items ?? []}
                placeholder=""
                defaultValue={items.find(
                  (item) => item.itemId == formData?.itemId,
                )}
                onChange={(_, value) =>
                  value &&
                  formData &&
                  setFormData({ ...formData, itemId: value.itemId })
                }
                getOptionLabel={(option) => option.itemName}
                disabled={mode == "Edit"}
                renderInput={(params) => (
                  <TextField {...params} autoFocus={true} label="Item" />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="method"
              label="Method"
              variant="outlined"
              multiline
              minRows={3}
              fullWidth
              value={formData?.method}
              onChange={(e) => {
                formData &&
                  setFormData({ ...formData, method: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="note"
              label="Note"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={formData?.note}
              onChange={(e) => {
                e.preventDefault();
                formData &&
                  setFormData({ ...formData, note: e.target.value.trim() });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="address"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={formData?.address}
              onChange={(e) => {
                e.preventDefault();
                formData &&
                  setFormData({ ...formData, address: e.target.value });
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

type Order = "asc" | "desc";

interface HeadCell {
  id: MethodColumn;
  label: string;
}

const headCells: readonly HeadCell[] = [
  { id: "id", label: "ID" },
  { id: "itemId", label: "Item" },
  {
    id: "method",
    label: "Method",
  },
  { id: "note", label: "Note" },
  { id:"address",label:"Address"}
];

export default function CollectionMethods({
  methods, council, user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [councilId, setcouncilId] = useState(user.councilId)
  // rows

  const [methodList, setMethodList] = useState<Method[]>(methods);
  const [rows, setRows] = useState<Method[]>(methodList.filter((m) => m.councilId === councilId));

  const [itemMap, setItemMap] = useState({});
  const [items, setItems] = useState<CachedItems>([]);
  useEffect(() => {
    const fetchItems = async () => {
      const items = await fetchItemsFromAPI();
      setItems(items);
      setItemMap(Object.fromEntries(items.map((item) => [item.itemId, item])));
    };
    fetchItems();
  }, []);
  // sorting
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<MethodColumn>("id");
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
    let selectedcouncil  = localStorage.getItem('collectionselectedCouncil');
    if (selectedcouncil) {
      let newselectedcouncil = parseInt(selectedcouncil)
      setcouncilId(newselectedcouncil)
      setRows(methodList.filter((m) => m.councilId === newselectedcouncil));
    } 
  }
  }, [councilId]);


  // forms
  type FormMode = "Create" | "Edit";
  const [openModal, setOpenModal] = useState(false);
  const [formInitValue, setFormInitValue] = useState<FormMethod>({
    itemId: items[0]?.itemId,
    method: "",
    note: "",
    address:""
  });
  const [mode, setMode] = useState<FormMode>("Create");
  const onFormConcel = () => setOpenModal(false);
  const onFormConfirm = async (method: FormMethod, mode: FormMode) => {
    if (mode == "Edit") {
      try {
        const response = await fetch(`/api/method/update/`, {
          method: "POST",
          body: JSON.stringify({
            id: method.id,
            note: method.note,
            method: method.method,
            address:method.address
          } as UpdateRequestInput),
        });
        const data: UpdateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to update method");
        } else {

          setRows(rows.map((m) => (m.id == method.id ? data : m)));
          setMethodList(methodList.map((m) => (m.id == method.id ? data : m)));

        }
      } catch (error) {
        console.error(error);
        alert("Failed to update method");
      }
    } else {
      try {
        const response = await fetch(`/api/method/create/`, {
          method: "POST",
          body: JSON.stringify({
            councilId: councilId,
            itemId: method.itemId,
            note: method.note,
            method: method.method,
            address:method.address
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
    setFormInitValue({ itemId: items[0].itemId, note: "", method: "" ,address:""});
    setMode("Create");
    setOpenModal(true);
  };

  const onEdit = (m: Method) => {
    setFormInitValue(m);
    setMode("Edit");
    setOpenModal(true);
  };

  const onDelete = async (method: Method) => {
    if (
      confirm(
        `Are you sure you want to delete collection method "${method.method}?"`,
      )
    ) {
      try {
        const response = await fetch(`/api/method/delete/`, {
          method: "DELETE",
          body: JSON.stringify({
            id: method.id,
          }),
        });
        const data: CreateResponseData = await response.json();
        if ("error" in data) {
          console.error(data.error);
          alert("Failed to delete method");
        } else {
          setRows(rows.filter((m) => m.id != method.id));
          setMethodList(methodList.filter((m) => m.id != method.id))
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
            <h6 className="text-2xl">Drop Off Methods</h6>
          </header>
          <div className="p-2">
            <Button onClick={onCreate}>Create New Methods</Button>
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
                  setRows(methodList.filter((m) => m.councilId === value.id));
                  setcouncilId(value.id)
                  localStorage.setItem("collectionselectedCouncil",value.id.toString())
                }
              }}

              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} autoFocus={true} label="Council Selected" />
              )}
            />}
          <MethodForm
            open={openModal}
            mode={mode}
            items={items}
            formData={formInitValue}
            setFormData={setFormInitValue}
            onCancel={onFormConcel}
            onConfirm={onFormConfirm}
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
                      key={row.id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        {
                          // @ts-ignore
                          itemMap?.[row.itemId]?.itemName ?? row.itemId
                        }
                      </TableCell>
                      <TableCell>{row.method}</TableCell>
                      <TableCell>{row.note}</TableCell>
                      <TableCell>{row.address}</TableCell>
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
