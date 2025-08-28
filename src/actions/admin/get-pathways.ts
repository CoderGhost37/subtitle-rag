"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";

export async function getPathways() {
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
        documents: {
          select: {
            id: true,
            name: true,
            fileType: true,
            fileSize: true,
            createdAt: true,
          },
        },
      },
    });
    return pathways;
  } catch (error) {
    console.error("Error fetching pathways:", error);
    return [];
  }
}

export type PathwayType = Awaited<ReturnType<typeof getPathways>>[0];
