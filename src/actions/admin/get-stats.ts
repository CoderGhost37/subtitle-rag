"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";

export async function getStats() {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const totalPathways = await db.pathway.count();
    const totalDocuments = await db.document.count();

    return {
      totalPathways,
      totalDocuments,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}
