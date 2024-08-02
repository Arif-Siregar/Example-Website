import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { Prisma } from "@prisma/client";

const Errors = {
  error: "Something went wrong.",
};

export type RequestInput = {
  councilId: number|null;
  heading:string,
  message:string,
  link:string|null,

};

export type OkResponse = {
  councilId: number|null;
  notificationId:number;
  heading:string;
  message:string;
  link:string|null;

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
    const Notification = await prisma.notifications.create({
      data: {
        councilId:request.councilId,
        message: request.message,
        link:request.link,
        heading:request.heading
      }
    });
    return res.json(Notification);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
}
