import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully delete the collection method.",
};

// how to auto infer this type?
export type ResponseData = typeof Errors | typeof Success;

export default async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const request = JSON.parse(req.body);
  try {
    const method = await prisma.bin.delete({
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
