import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

export type RequestInput = {
  colorCode: string;
  type: string;
  image: string | null;
  can: string | null;
  cannot: string | null;
  councilId: number;
  bintypeId:number | null;
};

export type OkResponse =
  | {
      id: number;
      colorCode: string;
      type: string;
      image: string | null;
      can: string;
      cannot: string;
      councilId: number;
      bintypeId:number | null
    }
  | typeof Errors;

export type ResponseData = OkResponse | typeof Errors;

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse<OkResponse>,
) {
  if (req.method === "POST") {
    const request = JSON.parse(req.body);
    try {
      const binCreate = await prisma.bin.create({
        data: {
          councilId: request.councilId,
          colorCode: request.colorCode,
          type: request.type,
          image: request.image,
          can: request.can,
          cannot: request.cannot,
          bintypeId:request.bintypeId
        },
      });
      return res.status(200).json(binCreate);
    } catch (error) {
      console.error(error);
      return res.status(500).json(Errors);
    }
  } else {
    return res.status(405).json(Errors);
  }
}
