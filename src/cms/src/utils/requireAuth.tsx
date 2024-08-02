import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { supabase } from "./supabaseClient";
import prisma from "./prisma";

export const requireAuth = (
  getServerSidePropsFunc?: (
    ctx: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<any>>
): GetServerSideProps => {
  return async (ctx: GetServerSidePropsContext) => {
    const token = ctx.req.cookies["sb:token"];

    if (!token) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    if (data.user.email == undefined) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
          statusCode: 401,
        },
      };
    }

    const prismaUser = await prisma.user.findFirst({
      where: {
        email: data.user.email,
      },
    });

    if (ctx.params) {
      ctx.params.role = prismaUser?.role?.toString();
      ctx.params.councilId = prismaUser?.councilId?.toString();
      ctx.params.userId = prismaUser?.id?.toString();
    } else {
      ctx.params = {
        role: prismaUser?.role?.toString(),
        councilId: prismaUser?.councilId?.toString(),
        userId: prismaUser?.id?.toString(),
      };
    }

    if (getServerSidePropsFunc) {
      return await getServerSidePropsFunc(ctx);
    } else {
      return { props: { user: data } };
    }
  };
};

export const getUserFromDb = async (ctx: GetServerSidePropsContext) => {
  const token = ctx.req.cookies["sb:token"];
  if (!token) {
    return {
      error: "No token",
    };
  }

  const response = await supabase.auth.getUser(token);
  if (response.error || response.data.user.email == undefined) {
    return {
      error: "Failed to get user from supabase auth",
    };
  }

  const prismaUser = await prisma.user.findFirst({
    where: {
      email: response.data.user.email,
    },
  });

  if (prismaUser?.email == undefined) {
    return {
      error: "Failed to get user from prisma",
    };
  }

  return {
    email: prismaUser.email,
    role: prismaUser.role,
    councilId: prismaUser.councilId,
  };
};
