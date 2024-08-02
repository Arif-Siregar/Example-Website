import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
  error: "Something went wrong.",
};

const Success = {
  success: "Successfully delete the collection method.",
};
export type RequestInput = {
  id: number;
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
  image : string | null;
  itemDBImg : string | null;
};

// how to auto infer this type?
export type ResponseData = OkResponse | typeof Errors;

export default async function UPDATE(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const request = JSON.parse(req.body);
  try {
    const method = await prisma.item.update({
      data: {
        name: request.name,
        subCategoryId: request.subCategoryId,
        code: request.code,
        image: request.image,
        itemDBImg: request.itemDBImg
      },
      where: {
        id: request.id,
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
    return res.status(200).json(method);
  } catch (error) {
    console.error(error);
    return res.status(500).json(Errors);
  }
}
