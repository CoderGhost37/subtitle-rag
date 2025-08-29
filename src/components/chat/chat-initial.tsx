"use client";

import { useEffect } from "react";
import type { PathwayBasicInfoType } from "@/actions/admin/get-pathways-basic-info";
import { usePathwayStore } from "@/hooks/use-pathway";
import { usePathwayPickerDialogStore } from "@/hooks/use-pathway-picker-dialog";
import { ChatInterface } from "./chat-interface";
import { PathwayPickerDialog } from "./pathway-picker-dialog";

export function ChatInitial({
  pathways,
}: {
  pathways: PathwayBasicInfoType[];
}) {
  const { pathwayName, pathwayId, setPathway } = usePathwayStore();
  const { open, toggle } = usePathwayPickerDialogStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    toggle();
  }, []);

  return (
    <div>
      <div className="flex-1 flex flex-col">
        {pathwayId && pathwayName ? (
          <ChatInterface />
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
        onOpenChange={toggle}
        pathways={pathways}
        onSelect={setPathway}
      />
    </div>
  );
}
