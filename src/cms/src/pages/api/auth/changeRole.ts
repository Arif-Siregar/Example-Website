import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { UserRole } from "@prisma/client";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully updated user role.",
};

export type ChangeRoleRequest = {
  userId: number;
  newRole: string;
};

export type OkResponse = {
  userId: number;
  newRole: string;
};

export type ResponseData = OkResponse | typeof Errors;

export default async function changeRole(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {


   

  const request: ChangeRoleRequest = JSON.parse(req.body);

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: request.userId,
      },
      data: {
        role: request.newRole as UserRole,
      },
    });

    const newRole = updatedUser.role ? updatedUser.role : 'USER';

    return res.status(200).json({
      userId: updatedUser.id,
      newRole: newRole,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
