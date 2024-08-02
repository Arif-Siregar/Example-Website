import type { NextApiRequest, NextApiResponse } from "next";
import { parse as csvparser } from "csv-parse";
import prisma from "../../../utils/prisma";

type Errors = {
  error: string;
};

type Ok = {
  message: string;
};

export type ResponseData = Ok | Errors;

const readcsv = async <T>(csvcontent: string) => {
  const parser = csvparser({ columns: true });
  const records = new Array<T>();

  parser
    .on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    })
    .on("error", (err) => {
      throw err;
    });

  parser.write(csvcontent);
  parser.end();
  return records;
};

type ItemCSVColumns = { Category: string; Subcategory: string; Item: string };
async function bulkUpload(records: ItemCSVColumns[]) {
  const catemap = new Map<string, Record<string, Set<string>>>();
  for (const { Category, Subcategory, Item } of records) {
    if (!catemap.has(Category)) {
      catemap.set(Category, {});
    }
    const submap = catemap.get(Category)!;
    if (!submap[Subcategory]) {
      submap[Subcategory] = new Set();
    }
    submap[Subcategory].add(Item);
  }

  const categories: { name: string; id: number }[] = [];
  const subcategories: {
    name: string;
    id: number;
    primaryMaterialId: number;
  }[] = [];
  const allitems: { name: string; id: number; subCategoryId: number }[] = [];
  let i = 0,
    j = 0,
    k = 0;

  Array.from(catemap.entries()).forEach(([category, submap]) => {
    i++;
    categories.push({ name: category, id: i });
    Array.from(Object.entries(submap)).forEach(([subcategory, items]) => {
      j++;
      subcategories.push({ name: subcategory, id: j, primaryMaterialId: i });
      items.forEach((item) => {
        k++;
        allitems.push({ name: item, id: k, subCategoryId: j });
      });
    });
  });

  await prisma.$transaction([
    prisma.primaryMaterial.createMany({
      data: JSON.parse(JSON.stringify(categories)),
    }),
    prisma.subCategory.createMany({
      data: subcategories,
    }),
    prisma.item.createMany({
      data: allitems,
    }),
  ]);
  return { message: "ok" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method != "POST") {
    return res.status(405);
  }
  const records = await readcsv<ItemCSVColumns>(req.body).catch((err) => {
    console.error(err);
    return { error: "incorrect csv file" };
  });
  if ("error" in records) {
    return res.status(500).json(records);
  }

  const bulk = await bulkUpload(records).catch((err) => {
    console.error(err);
    return { error: "failed to upload to db, double check the file." };
  });
  if ("error" in records) {
    return res.status(500).json(bulk);
  }

  return res.status(200).json({ message: "ok" });
}
