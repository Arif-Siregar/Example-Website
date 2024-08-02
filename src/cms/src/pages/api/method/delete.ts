import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { NextResponse } from "next/server";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully delete the collection method.",
};

// how to auto infer this type?
export type ResponseData = typeof Errors | typeof Success;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method != "POST" && req.method != "DELETE") {
    return res.status(405);
  }
  const request = JSON.parse(req.body);
  try {
    await prisma.method.delete({
      where: {
        id: request.id,
      },
    });
    return res.status(200).json(Success);
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
