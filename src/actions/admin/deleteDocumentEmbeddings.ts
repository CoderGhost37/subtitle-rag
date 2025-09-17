"use server";

import { QdrantClient } from "@qdrant/js-client-rest";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";

export async function deleteDocumentEmbeddings(docId: string) {
  try {
    const doc = await db.document.findUnique({
      where: {
        id: docId,
      },
      select: {
        sourceId: true,
      },
    });

    if (!doc || !doc.sourceId) {
      return {
        success: false,
        message: "Document not found",
      };
    }

    const collectionName = process.env.QDRANT_COLLECTION_NAME;
    const qdrantUrl = process.env.QDRANT_URL;

    if (!collectionName || !qdrantUrl) {
      return {
        success: false,
        message: "Qdrant configuration not found",
      };
    }

    const qdrantClient = new QdrantClient({
      url: qdrantUrl,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const pointsToDelete = [];
    let offset = null;

    do {
      const scrollResult = await qdrantClient.scroll(collectionName, {
        limit: 1000,
        offset: offset,
        with_payload: true,
        with_vector: false,
      });

      if (scrollResult.points) {
        const matchingPoints = scrollResult.points.filter((point) => {
          const metadata = (point.payload?.metadata ?? {}) as {
            sourceId?: string;
          };
          return metadata.sourceId === doc.sourceId;
        });
        pointsToDelete.push(...matchingPoints);
      }

      offset = scrollResult.next_page_offset;
    } while (offset);

    if (pointsToDelete.length === 0) {
      console.log("No embeddings found for sourceId:", doc.sourceId);
    } else {
      const pointIds = pointsToDelete.map((point) => point.id);
      console.log(
        `Deleting ${pointIds.length} embeddings for sourceId: ${doc.sourceId}`,
      );

      await qdrantClient.delete(collectionName, {
        points: pointIds,
      });
    }

    await db.document.delete({
      where: {
        id: docId,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/pathways");

    return {
      success: true,
      message: "Embedding deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting embedding:", error);
    return {
      success: false,
      message: "Failed to delete embedding",
    };
  }
}
