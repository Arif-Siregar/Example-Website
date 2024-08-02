import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../utils/supabaseClient";
import prisma from "../../../utils/prisma";
import cookie from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    res.writeHead(302, {
      Location: "/admin?error=Could not authenticate user",
    });
    res.end();
    return;
  }

  if (data?.session) {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("sb:token", data.session.access_token, {
        maxAge: data.session.expires_in,
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }),
    );

    res.writeHead(302, { Location: "/admin/binMan" });
  } else {
    res.writeHead(302, {
      Location: "/admin?error=Session data is not available",
    });
  }
  res.end();
}
