import type { Metadata } from "next";
import { PathwayDialog } from "@/components/admin/pathway/pathway-dialog-form";
import { Pathways } from "@/components/admin/pathway/pathways";

export const metadata: Metadata = {
  title: "Learning Pathways",
  description: "Manage and view your learning pathways",
};

export default function PathwaysPage() {
  return (
    <main>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-3xl font-bold">Learning Pathways</p>
            <p className="mt-1 text-muted-foreground">
              Manage pathways and view their documents
            </p>
          </div>
          <PathwayDialog />
        </div>

        <Pathways />
      </div>
    </main>
  );
}
