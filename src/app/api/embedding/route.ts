import { randomUUID } from "node:crypto";
import { currentUser } from "@clerk/nextjs/server";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { uploadSchema } from "@/schemas/upload";

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const formData = await req.formData();
    const filesValue = formData.getAll("files") as File[];
    const pathwayIdValue = formData.get("pathwayId") as string;
    const values = {
      pathwayId: pathwayIdValue,
      files: filesValue,
    };

    const validateFields = uploadSchema.safeParse(values);
    if (!validateFields.success) {
      console.log(validateFields.error);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input",
        },
        { status: 400 },
      );
    }

    const { pathwayId, files } = validateFields.data;

    for (const file of files) {
      const text = await file.text();

      const docs = [
        new Document({
          pageContent: text,
          metadata: { fileName: file.name },
        }),
      ];
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.splitDocuments(docs);

      const sourceId = randomUUID();
      const chunksWithIds = chunks.map((chunk) => {
        return {
          ...chunk,
          metadata: {
            ...chunk.metadata,
            sourceId,
            pathwayId,
          },
        };
      });

      const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
      });

      await QdrantVectorStore.fromDocuments(chunksWithIds, embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
      });

      await db.document.create({
        data: {
          pathwayId,
          name: file.name,
          fileType: file.type === "application/x-subrip" ? "SRT" : "VTT",
          fileSize: formatBytes(file.size),
          sourceId,
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/pathways");
    return NextResponse.json(
      {
        success: true,
        message: "Files uploaded successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error uploading files",
      },
      { status: 500 },
    );
  }
}
