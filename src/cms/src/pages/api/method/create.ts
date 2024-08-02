import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { Prisma } from "@prisma/client";

const Errors = {
  error: "Something went wrong.",
};

export type RequestInput = {
  councilId: number;
  itemId: number;
  method?: string | null | undefined;
  binId?: number | null | undefined;
  note?: string | null | undefined;
  address? : string | null | undefined;
};

export type OkResponse = {
  item: {
    id: number;
    name: string;
  };
  id: number;
  councilId: number;
  itemId: number;
  method: string | null;
  binId: number | null;
  note: string | null;
  address : string | null;
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
    const method = await prisma.method.create({
      data: {
        method: request.method,
        councilId: request.councilId,
        itemId: request.itemId,
        note: request.note,
        binId: request.binId,
        address:request.address
      },
      include: {
        item: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return res.json(method);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
