"use client";

import React from "react";
import type { PathwayBasicInfoType } from "@/actions/admin/get-pathways-basic-info";
import { usePathwayStore } from "@/hooks/use-pathway";
import { PathwayPickerDialog } from "./pathway-picker-dialog";

export function ChatInitial({
  pathways,
}: {
  pathways: PathwayBasicInfoType[];
}) {
  const { pathwayName, pathwayId, setPathway } = usePathwayStore();
  const [open, setOpen] = React.useState(true);
  return (
    <div>
      <div className="flex-1 flex flex-col">
        {pathwayId && pathwayName ? (
          <p>CHAT with {pathwayName}</p>
        ) : (
          <div className="flex-1 h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Select a Pathway</h2>
              <p className="text-muted-foreground">
                Choose a pathway to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      <PathwayPickerDialog
        open={open}
        onOpenChange={() => setOpen((prev) => !prev)}
        pathways={pathways}
        onSelect={setPathway}
      />
    </div>
  );
}
