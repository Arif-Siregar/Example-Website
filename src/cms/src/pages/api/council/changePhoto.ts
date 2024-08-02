import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully updated council image.",
};

export type CouncilChangeRequest = {
  userId: number;
  councilId: number;
  councilImage: string;
};

export type OkResponse = {
  userId: number;
  councilId: number | null;
  councilmage: string;
};

export type ResponseData = OkResponse | typeof Errors;

export default async function councilChange(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const request: CouncilChangeRequest = JSON.parse(req.body);

  try {
    const updatedUser = await prisma.council.update({
      where: {
        id: request.councilId,
      },
      data: {
        //: request.councilId,
       // userId: request.userId,
        councilImage : request.councilImage
        
      },
    });

    return res.status(200).json({
      userId: updatedUser.id,
      councilId: updatedUser.id,
      councilmage : updatedUser.councilImage ? updatedUser.councilImage : ""
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
