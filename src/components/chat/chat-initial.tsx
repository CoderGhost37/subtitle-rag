"use client";

import { useEffect } from "react";
import type { PathwayBasicInfoType } from "@/actions/admin/get-pathways-basic-info";
import { usePathwayStore } from "@/hooks/use-pathway";
import { usePathwayPickerDialogStore } from "@/hooks/use-pathway-picker-dialog";
import { Button } from "../ui/button";
import { ChatInterface } from "./chat-interface";
import { PathwayPickerDialog } from "./pathway-picker-dialog";

export function ChatInitial({
  pathways,
  userId,
}: {
  pathways: PathwayBasicInfoType[];
  userId: string;
}) {
  const { pathwayName, pathwayId, setPathway } = usePathwayStore();
  const { open, toggle } = usePathwayPickerDialogStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    toggle();
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      {pathwayId && pathwayName ? (
        <ChatInterface userId={userId} />
      ) : (
        <div className="flex flex-1 items-center justify-center h-full w-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-1">Select a Pathway</h2>
            <p className="text-muted-foreground mb-4">
              Choose a pathway to start chatting
            </p>
            <Button variant="outline" size="sm" onClick={toggle}>
              Select Pathway
            </Button>
          </div>
        </div>
      )}

      <PathwayPickerDialog
        open={open}
        onOpenChange={toggle}
        pathways={pathways}
        onSelect={setPathway}
      />
    </div>
  );
}
