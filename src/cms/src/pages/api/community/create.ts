import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { Prisma } from "@prisma/client";

const Errors = {
  error: "Something went wrong.",
};

export type RequestInput = {
  councilId: number;
  name: string;
  link: string | null;
  location:string;
  frequency:string | null;
  method:string;
  notes:string | null;
};

export type OkResponse = {
  communityId:number;
  councilId: number;
  name: string;
  link: string | null;
  location:string;
  frequency:string | null;
  method:string;
  notes:string | null;

};
export type ResponseData = OkResponse | typeof Errors;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method != "POST") {
    return res.status(405);
  }

  const request = JSON.parse(req.body);
  try {
    //console.log(request)
    const Community = await prisma.community.create({
      data: {
        councilId:request.councilId,
        name: request.name,
        link:request.link,
        location:request.location,
        frequency:request.frequency,
        method:request.method,
        notes:request.notes
      }
    });
    return res.json(Community);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
