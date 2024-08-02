import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully delete the collection method.",
};
export type RequestInput = {
  id: number;
  colorCode: string;
  type: string;
  image: string | null;
  can: string | null;
  cannot: string | null;
  councilId: number;
  bintypeId:number|null;
};


export type OkResponse = {
    id: number;
    colorCode: string;
    type: string;
    image: string | null;
    can: string ;
    cannot: string ;
    councilId: number;
    bintypeId:number|null;
};

// how to auto infer this type?
export type ResponseData = OkResponse | typeof Errors;

export default async function UPDATE(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const request = JSON.parse(req.body);
  try {
    const method = await prisma.bin.update({
      data: {
        colorCode: request.colorCode,
        type: request.type,
        image: request.image,
        can:request.can,
        cannot:request.cannot,
        councilId:request.councilId,
        bintypeId:request.bintypeId

      },
      where: {
        id: request.id,
      }
    });
    return res.status(200).json(method);
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
