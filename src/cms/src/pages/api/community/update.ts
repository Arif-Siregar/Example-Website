import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully delete the collection method.",
};
export type RequestInput = {
    communityId:number;
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

// how to auto infer this type?
export type ResponseData = OkResponse | typeof Errors;

export default async function UPDATE(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const request = JSON.parse(req.body);
  try {
    const community = await prisma.community.update({
      data: {
        councilId:request.councilId,
        name: request.name,
        link:request.link,
        location:request.location,
        frequency:request.frequency,
        method:request.method,
        notes:request.notes

      },
      where: {
        communityId: request.communityId,
      }
    });
    return res.status(200).json(community);
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
