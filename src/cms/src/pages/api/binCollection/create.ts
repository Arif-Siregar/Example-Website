import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

export type RequestInput = {
    councilId: number;
    dayName: string;
    binType: number;
    frequency: string | null;
    collectDate: string | null;
    collectMode: number | null;
    specialCollectNote: string;
};

export type OkResponse =
  | {
      id: number;
      councilId: number;
        dayName: string;
        binType: number;
        frequency: string;
        collectDate: string;
        collectMode: number | null;
    }
  | typeof Errors;

export type ResponseData = OkResponse | typeof Errors;

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse<OkResponse>,
) {
  if (req.method === "POST") {
    const request = JSON.parse(req.body);
    try {
      const binCreate = await prisma.binCollectDates.create({
        data: {
            councilId: request.councilId,
            dayName: request.dayName,
            binType: request.binType,
            frequency: request.frequency,
            collectDate: request.collectDate,
            collectMode: request.collectMode,
            specialCollectNote: request.specialCollectNote
            
        },
      });
      return res.status(200).json(binCreate);
    } catch (error) {
      console.error(error);
      return res.status(500).json(Errors);
    }
  } else {
    return res.status(405).json(Errors);
  }
}
