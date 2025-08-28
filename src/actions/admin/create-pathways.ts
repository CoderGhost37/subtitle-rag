"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import type { PathwaySchemaType } from "@/schemas/pathway";

export async function createPathway(values: PathwaySchemaType) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    await db.pathway.create({
      data: {
        title: values.title,
        description: values.description,
      },
    });

    revalidatePath("/admin/pathways");
    return { success: true, message: "Pathway created successfully" };
  } catch (error) {
    console.error("Error creating pathway:", error);
    return {
      success: false,
      message: "Failed to create pathway",
    };
  }
}
