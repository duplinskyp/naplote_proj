// File: /pages/api/addPaymentInfo.js

import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const body = await request.json();
  const { iban } = body;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return new Response(JSON.stringify({ success: false, message: 'User not found or not authenticated' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const user = await prisma.user.update({
      where: { email: currentUser.email as string},
      data: { IBAN: iban },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to update user IBAN:", error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to update IBAN' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
