import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { Prisma } from "@prisma/client";

const Errors = {
  error: "Something went wrong.",
};

export type RequestInput = {
  community_item_map:{
    communityId:number,
    itemId:number
  }[]
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != "POST") {
    return res.status(405);
  }

  const request = JSON.parse(req.body);
  try {
    //console.log(request)
    const Community_item = await prisma.community_item_mapping.createMany({
      data:request.community_item_map
    });
    return res.json(Community_item);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
