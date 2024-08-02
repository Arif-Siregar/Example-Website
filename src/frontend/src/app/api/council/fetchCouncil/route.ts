import prisma from '../../../../utils/prisma';
import { NextResponse } from 'next/server';

// API used to extract all the Council values with respect to each region:
export async function GET(req: Request) {
  try {
    console.log(req)
    const data = await prisma.suburb.findMany({
      select: {
        postcode: true,
        name: true,
        council: {
          // Joining to the council table to retrieve the council id and name
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error);
  }
}

