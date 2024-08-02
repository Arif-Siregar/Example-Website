import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

export type binDaysData = {
  id: number;
  councilId: number;
  dayName: string;
  binType: number;
  frequency: string;
  collectDate: string;
  specialCollectNote: string | null;
};

export type binTypesData = {
  type: string | null;
};

export type ResponseData =
  | { binDays: Array<binDaysData>; binTypes: Array<binTypesData> }
  | typeof Errors;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method != "GET") {
    return res.status(405);
  }
  let councilId = req.query.councilId?.toString();
  try {
    if (councilId) {
      const binDayData = await prisma.binCollectDates.findMany({
        where: {
          councilId: Number.parseInt(councilId.toString()),
        },
        select: {
          binType: true,
          collectDate: true,
          councilId: true,
          dayName: true,
          frequency: true,
          id: true,
          BinType: true,
          specialCollectNote: true,
        },
      });

      const binTypeData = await prisma.bin.findMany({
        where: {
          councilId: Number.parseInt(councilId.toString()),
        },
        select: {
          type: true,
        },        
      });

      return res.status(200).json({ binDays: binDayData, binTypes: binTypeData });
    } else {
      return res.status(405);
    }
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}
