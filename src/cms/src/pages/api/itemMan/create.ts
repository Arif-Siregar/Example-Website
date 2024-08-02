import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

// how to auto infer this type?

export type RequestInput = {
  name: string | null;
  subCategoryId: number | null;
  code: string | null;

};

export type OkResponse = {
  subCategory: {
    name: string;
    PrimaryMaterial: {
      id: number;
      name: string;
      code: string | null;
    };
  } | null;
} & {
  id: number;
  name: string;
  subCategoryId: number | null;
  code: string | null;
  image: string | null;
  itemDBImg: string | null;

};
export type ResponseData = OkResponse | typeof Errors;

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "POST") {
    const request = JSON.parse(req.body);
    try {
      const itemCreate = await prisma.item.create({
        data: {
          name: request.name,
          subCategoryId: request.subCategoryId,
          code: request.code,
          image: request.image,
          itemDBImg: request.itemDBImg
        },
        include:{
          subCategory:{
            select:{
              id: true,
              name: true,
              PrimaryMaterial:{
          
              }
            }
          }
        }
      });
      return res.status(200).json(itemCreate);
    } catch (error) {
      console.error(error);
      return res.status(500).json(Errors);
    }
  } else {
    return res.status(405).json(Errors);
  }
}
