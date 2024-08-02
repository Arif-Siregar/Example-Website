import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";

const Errors = {
    error: "Something went wrong.",
};

export type subCategory = {
    subCategoryId: number;
    subCategoryName: string;
    PrimaryMaterial: string;
    subCategoryCode: string;

};
export type ResponseData = Array<subCategory> | typeof Errors;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    if (req.method != "GET") {
        return res.status(405);
    }
    try {
        const allsubCategory = prisma.$queryRaw<Array<subCategory>>`
  select
    subCategory.id as "subCategoryId",
    subCategory.name as "subCategoryName",
    pm.name as "PrimaryMaterial"
    subCategory.code as "subCategoryCode"
    "SubCategory" as subCategory
    left join "PrimaryMaterial" as pm on subCategory."primaryMaterialId" = pm.id`;

        res.status(200).json(await allsubCategory);
    } catch (error) {
        res.status(500).json(Errors);
    }
}
