"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { type PathwaySchemaType, pathwaySchema } from "@/schemas/pathway";

export async function createPathway(values: PathwaySchemaType) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validateFields = pathwaySchema.safeParse(values);
    if (!validateFields.success) {
      return {
        success: false,
        message: "Invalid input",
      };
    }

    await db.pathway.create({
      data: validateFields.data,
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
