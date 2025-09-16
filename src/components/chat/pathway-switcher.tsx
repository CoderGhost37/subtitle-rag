"use client";

import { ArrowLeftRight } from "lucide-react";
import Image from "next/image";
import { usePathwayStore } from "@/hooks/use-pathway";
import { usePathwayPickerDialogStore } from "@/hooks/use-pathway-picker-dialog";
import { getPathwayIcon } from "@/utils/getPathwayIcon";
import { Button } from "../ui/button";

export function PathwaySwitcher({ disabled }: { disabled?: boolean }) {
  const { pathwayName } = usePathwayStore();
  const { toggle } = usePathwayPickerDialogStore();
  return (
    <div className="rounded-md border p-3 flex items-center justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {pathwayName && (
            <Image
              src={getPathwayIcon(pathwayName)}
              alt={pathwayName}
              width={30}
              height={30}
            />
          )}
          <span className="font-medium truncate">
            {pathwayName || "No pathway selected"}
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="ml-2 shrink-0 bg-transparent"
        onClick={toggle}
        disabled={disabled}
        aria-label="Switch pathway"
      >
        <ArrowLeftRight className="h-4 w-4 mr-1" />
        Switch
      </Button>
    </div>
  );
}
