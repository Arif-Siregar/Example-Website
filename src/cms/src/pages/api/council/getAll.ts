import prisma from "../../../utils/prisma";
import React from "react";



async function refreshCouncilList() {
    await  prisma.council.findMany({});
}