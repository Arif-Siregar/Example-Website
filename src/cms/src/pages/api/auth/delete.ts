import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully deleted the user.",
};

export type ResponseData = typeof Errors | typeof Success;

export default async function deleteUser(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const { id } = JSON.parse(req.body);

    if (!id) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return res.status(200).json(Success);
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json(Errors);
  }
}
