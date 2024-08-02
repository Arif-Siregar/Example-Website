import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully updated user council.",
};

export type CouncilChangeRequest = {
  userId: number;
  councilId: number;
};

export type OkResponse = {
  userId: number;
  councilId: number | null;
};

export type ResponseData = OkResponse | typeof Errors;

export default async function councilChange(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const request: CouncilChangeRequest = JSON.parse(req.body);

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: request.userId,
      },
      data: {
        councilId: request.councilId,
      },
    });

    return res.status(200).json({
      userId: updatedUser.id,
      councilId: updatedUser.councilId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
