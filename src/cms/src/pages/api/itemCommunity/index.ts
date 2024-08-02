import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { error } from "console";

const Errors = {
  error: "Something went wrong.",
};

export type itemCommunity = {
  itemId: number;
  itemName: string;
};
export type ResponseData = Array<itemCommunity> | typeof Errors;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method != "GET") {
    return res.status(405);
  }
  try {
    const allitems = prisma.$queryRaw<Array<itemCommunity>>`
  select
  "id" as "itemId",
  "name" as "itemName"
  from
  "Item"
  `;
    res.status(200).json(await allitems);
  } catch (error) {
    res.status(500).json(Errors);
  }
}
