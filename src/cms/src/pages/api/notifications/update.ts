import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully delete the collection method.",
};
export type RequestInput = {
    notificationId:number;
    heading:string,
    message:string,
    link:string|null,
};


export type OkResponse = {
    notificationId:number;
    heading:string,
    message:string,
    link:string|null,
    councilId: number|null;
};

// how to auto infer this type?
export type ResponseData = OkResponse | typeof Errors;

export default async function UPDATE(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const request = JSON.parse(req.body);
  try {
    const notification = await prisma.notifications.update({
      data: {
        heading: request.heading,
        message:request.message,
        link:request.link
      },
      where: {
        notificationId: request.notificationId,
      }
    });
    return res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
