import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "../../../helper/mailer";
import { sanitizeInput } from '../../../components/Sanitiser';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { name, email, message } = reqBody

    const mailbody = await sendMail(sanitizeInput(name), sanitizeInput(email), sanitizeInput(message))
    console.log("response in route", mailbody);
    return NextResponse.json({
      mailbody

    })
  }
  catch (error: any) {
    return NextResponse.json({ error: error.message },
      { status: 500 })
  }

}