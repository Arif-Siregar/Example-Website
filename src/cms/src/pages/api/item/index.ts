import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

export type Item = {
  itemId: number;
  itemName: string;
  subCategory: string;
  PrimaryMaterial: string;
  itemNote: string;
  imageDBImg : File | null
};
export type ResponseData = Array<Item> | typeof Errors;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method != "GET") {
    return res.status(405);
  }
  try {
    const allItems = prisma.$queryRaw<Array<Item>>`
  select
    item.id as "itemId",
    item.name as "itemName",
    sub.name as "subCategory",
    pm.name as "PrimaryMaterial"
  from
    "Item" as item
    left join "SubCategory" as sub on Item."subCategoryId" = sub.id
    left join "PrimaryMaterial" as pm on sub."primaryMaterialId" = pm.id
  order by "itemName"
  `;

    res.status(200).json(await allItems);
  } catch (error) {
    res.status(500).json(Errors);
  }
}
