import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../utils/prisma";

const Errors = {
    error: "Something went wrong.",
  };
  
export type BinType = {
    bintypeid:number,
    binType: string
  };
  export type ResponseData = Array<BinType> | typeof Errors;
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    try {
        const allItems = await prisma.binType.findMany({});
    
        res.status(200).json(allItems);
      }
    catch(error)
    {
        console.log(error)
    }
}