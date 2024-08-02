import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';
import queryString from 'query-string';
import { sanitizeInput } from '../../../../components/Sanitiser';

// This APi is used to validate the scanning of a QR code before forwarding to explore page
export async function GET(req: NextRequest) {
  //sanitise the parameters:
  const queryParams = queryString.parseUrl(req.url).query;
  const specificCouncil = sanitizeInput(queryParams.council);
  const specificBin = sanitizeInput(queryParams.bin);
  if (!specificCouncil || !specificBin) {
    return NextResponse.json({ "error": "The 'specificCouncil' or 'specificBin' parameter is missing or null" });
  }

  try {
    const bin = await prisma.bin.findFirst({
      where: {
        council: {
          name: specificCouncil
        },
        type: specificBin
      }
    });
    const bins = await prisma.bin.findMany({
      where: {
        council: {
          name: specificCouncil
        },
      }
    });
    return NextResponse.json(bin !== null);
  }
  catch (error) {
    console.log(error);
    return NextResponse.json(false);
  }
}