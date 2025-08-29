"use client";

import Image from "next/image";
import * as React from "react";
import type { PathwayBasicInfoType } from "@/actions/admin/get-pathways-basic-info";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getPathwayIcon } from "@/utils/getPathwayIcon";

export function PathwayPickerDialog({
  open,
  onOpenChange,
  pathways,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  pathways: PathwayBasicInfoType[];
  onSelect: (pathway: PathwayBasicInfoType) => void;
}) {
  const [q, setQ] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return pathways;
    return pathways.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.description?.toLowerCase().includes(term) ?? false),
    );
  }, [q, pathways]);

  const confirmSelection = () => {
    if (!selectedId) return;
    const sel = pathways.find((p) => p.id === selectedId);
    if (!sel) return;
    onSelect(sel);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-pretty">Choose a pathway</DialogTitle>
          <DialogDescription className="text-pretty">
            Select the course context for your chat. You can change this later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Search pathways..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <ScrollArea className="mt-2 max-h-80 rounded-md border">
            <div className="p-2">
              <RadioGroup
                value={selectedId ?? ""}
                onValueChange={(v) => setSelectedId(v)}
                className="grid grid-cols-1 gap-2"
              >
                {filtered.map((p) => {
                  const isSelected = selectedId === p.id;
                  const inputId = `pathway-${p.id}`;
                  return (
                    <label
                      key={p.id}
                      htmlFor={inputId}
                      className={cn(
                        "flex items-start justify-between rounded-md border p-3 cursor-pointer transition-colors",
                        "hover:bg-muted/50",
                        isSelected ? "ring-2 ring-offset-1 ring-primary" : "",
                      )}
                      onDoubleClick={() => {
                        setSelectedId(p.id);
                        confirmSelection();
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={getPathwayIcon(p.title)}
                          alt={p.title}
                          width={40}
                          height={40}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{p.title}</p>
                          {p.description ? (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {p.description}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-3">
                        <RadioGroupItem id={inputId} value={p.id} />
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!selectedId}
              onClick={confirmSelection}
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
