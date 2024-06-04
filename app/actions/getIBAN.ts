// Upravte názov súboru a funkcie na getIBAN.ts

import prisma from "@/app/libs/prismadb";

export interface IGetIBANParams {
  userId: string;
}

export default async function getIBAN(
  params: IGetIBANParams
) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        IBAN: true, // Vyberáme iba IBAN
      }
    });

    return user ? user.IBAN : null;
  } catch (error: any) {
    throw new Error(error);
  }
}
