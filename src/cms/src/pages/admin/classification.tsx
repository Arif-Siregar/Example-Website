import React, { useEffect, useState } from "react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import {
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Autocomplete,
  TextField,
  DialogActions,
  Button,
  TextareaAutosize,
} from "@mui/material";

import prisma from "../../utils/prisma";
import type { OkResponse, RequestInput } from "../api/method/create";
import type { Item } from "../api/item";
import { fetchItemsFromAPI, type CachedItem } from "../../utils/cacahedData";
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

  const where = user.role === "SUPERADMIN" ? {} : { councilId: user.councilId };

  const bins = prisma.bin.findMany({
    where,
  });
  const methods = prisma.method.findMany({
    where: {
      ...where,
      NOT: {
        binId: null,
      },
    },
    include: {
      item: {
        select: {
          name: true,
        },
      },
    },
  });

  const council = await prisma.council.findMany({
    orderBy:{
      name:'asc'
    }
  });
  return {
    props: {
      bins: await bins,
      methods: await methods,
      user: user,
      council,
    },
  };
};

const ItemSelectModal = ({
  open,
  allItems,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  readonly allItems: Array<CachedItem>;
  onCancel: () => void;
  onConfirm: (items: CachedItem | undefined) => void | Promise<void>;
}) => {
  const [item, setItem] = useState<CachedItem>(allItems[0]);
  return (
    <Dialog disablePortal open={open} onClose={onCancel} fullWidth={true}>
      <div className="p-2">
        <DialogTitle>Add Items</DialogTitle>
        <Autocomplete
          fullWidth={true}
          className="w-full max-w-xl"
          options={allItems ?? []}
          value={item}
          onChange={(_, value) => value && setItem(value)}
          getOptionLabel={(option) => option.itemName}
          // groupBy={(option) => option.subCategory}
          renderInput={(params) => <TextField {...params} label="Item" />}
        />
        <br/>
        <TextField fullWidth={true}
          className="w-full max-w-xl" label="Item notes" 
          onChange={(e) => {
            e.preventDefault();
            item.itemNote = e.target.value.trim();
          }}
      />
        
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onConfirm(item)}>Confirm</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default function CollectionMethods({
  bins,
  methods,
  user,
  council,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [allItems, setItems] = useState<Array<Item>>([]);
  useEffect(() => {
    const fetchItems = async () => {
      setItems(await fetchItemsFromAPI());
    };
    fetchItems();
  }, []);
  const [councilId, setcouncilId] = useState(user.councilId);



  const [binList, setBinList] = useState<typeof bins>(
    bins.filter((m) => m.councilId === councilId),
  );
  const [methodList, setMethodList] = useState(methods);

  const [ms, setMethods] = useState<typeof methods>(
    methodList.filter((m) => m.councilId === councilId),
  );

  useEffect(() => {
    // Check if the selected council is present in the query parameters
    if(user.role=="SUPERADMIN")
    {
    let selectedcouncil  = localStorage.getItem('classificationselectedCouncil');
    if (selectedcouncil) {
      let newselectedcouncil = parseInt(selectedcouncil)
      setcouncilId(newselectedcouncil)
      setBinList(bins.filter((m) => m.councilId === newselectedcouncil));
      setMethods(methods.filter((m)=> m.councilId == newselectedcouncil ));
    } 
  }
  }, [councilId]);
 

  const onDeleteMethod = async (method: (typeof methods)[number]) => {
    if (
      confirm(
        `Are you sure you want to delete collection method "${method.item.name}?"`,
      )
    ) {
      await fetch("/api/method/delete", {
        method: "POST",
        body: JSON.stringify({
          id: method.id,
        }),
      });
      setMethodList(methodList.filter((m) => m.id != method.id));
      setMethods(ms.filter((m) => m.id != method.id));
    }
  };

  // modal
  const binMap = new Map(bins.map((b) => [b.id, b]));
  const [openModal, setOpenModal] = useState(false);
  const [selectedBin, setSelectedBin] = useState<number>();

  const onAdd = (binId: number) => {
    setSelectedBin(binId);
    setOpenModal(true);
  };
  const onCancelModal = () => {
    setOpenModal(false);
  };
  const onConfirmModal = async (item: CachedItem | undefined) => {
    console.log(item);
    if (!selectedBin) {
      alert("error, no bin selected");
      return;
    }
    if (!item) {
      alert("error, no items");
      return;
    }
    const bin = binMap.get(selectedBin);
    if (!bin) {
      alert("error, bad state");
      return;
    }

    const res = await fetch("/api/method/create", {
      method: "POST",
      body: JSON.stringify({
        councilId: councilId,
        itemId: item.itemId,
        note: item.itemNote,
        binId: binMap.get(selectedBin)?.id,
        method: "Put in " + bin.type.replaceAll("-", " "),
      } as RequestInput),
    });

    if (res.ok) {
      const newMethod = (await res.json()) as OkResponse;
      setMethods([...ms, newMethod]);
      setMethodList([...methodList, newMethod]);
      setOpenModal(false);
    } else {
      alert("Failed to add items");
    }
  };

  return (
    <Layout user={user}>
      <Card className="rounded-md p-5">
        <div className="flex flex-col gap-2">
          <ItemSelectModal
            open={openModal}
            allItems={allItems ?? []}
            onCancel={onCancelModal}
            onConfirm={onConfirmModal}
          />

          <header className="flex flex-col items-center justify-between">
            <h6 className="text-2xl">Classification</h6>
          </header>

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
                  setBinList(bins.filter((m) => m.councilId === value.id));
                  setMethods(
                    methodList.filter((m) => m.councilId === value.id),
                  );
                  setcouncilId(value.id);
                  localStorage.setItem("classificationselectedCouncil",value.id.toString())
                }
              }}
              // disabled={mode == "Edit"}
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

          {binList.map((bin) => (
            <Card className="p-2" key={bin.id}>
              <header className="text-xl">
                {bin.type.replaceAll("-", " ")}
              </header>
              <CardContent className="flex gap-1 flex-wrap">
                {ms
                  .filter((method) => method.binId == bin.id)
                  .map((method) => (
                    <button
                      key={method.id}
                      className="border border-gray-300 rounded-full px-2 py-1 text-xs hover:bg-red-200"
                      onClick={() => onDeleteMethod(method)}
                    >
                      { (method.note)?
                      method.item.name+"("+method.note+")":method.item.name}
                    </button>
                  ))}
                <button
                  className="border border-gray-300 rounded-full px-2 py-1 text-xs hover:bg-green-200"
                  onClick={() => onAdd(bin.id)}
                >
                  + Add
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
