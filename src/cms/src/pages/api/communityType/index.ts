import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { error } from "console";

const Errors = {
  error: "Something went wrong.",
};

export type communityType = {
  communitytypeId: number;
  name: string;
};
export type ResponseData = Array<communityType> | typeof Errors;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method != "GET") {
    return res.status(405);
  }
  try {
    const allcommunityType = prisma.$queryRaw<Array<communityType>>`
  select
  "communitytypeId",
  "name"
  from
  "Communitytype"
  `;
    res.status(200).json(await allcommunityType);
  } catch (error) {
    res.status(500).json(Errors);
  }
}
