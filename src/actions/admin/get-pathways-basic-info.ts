"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";

export async function getPathwaysBasicInfo() {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const pathways = await db.pathway.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
    return pathways;
  } catch (error) {
    console.error("Error fetching pathways:", error);
    return [];
  }
}

export type PathwayBasicInfoType = Awaited<
  ReturnType<typeof getPathwaysBasicInfo>
>[0];
