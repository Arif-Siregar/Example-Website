import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

export type RequestInput = {
  id: number;
  method: string | null;
  note: string | null;
  address:string | null;
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
  address:string | null;
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
    const method = await prisma.method.update({
      data: {
        method: request.method,
        note: request.note,
        address:request.address
      },
      where: {
        id: request.id,
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
