import type { Metadata } from "next";
import { getPathwaysBasicInfo } from "@/actions/admin/get-pathways-basic-info";
import { UploadForm } from "@/components/admin/upload/upload";

export const metadata: Metadata = {
  title: "Upload Documents",
  description: "Upload and manage content files for your learning pathways",
};

export default async function UploadPage() {
  const pathways = await getPathwaysBasicInfo();
  return (
    <main>
      <div className="space-y-6">
        <div className="mb-8">
          <p className="text-3xl font-bold">Upload Documents</p>
          <p className="mt-1 text-muted-foreground">
            Upload and manage content files for your learning pathways
          </p>
        </div>

        <UploadForm pathways={pathways} />
      </div>
    </main>
  );
}
