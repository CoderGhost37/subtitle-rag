"use client";

import {
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PathwayType } from "@/actions/admin/get-pathways";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getPathwayIcon } from "@/utils/getPathwayIcon";

export function Pathway({ pathway }: { pathway: PathwayType }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl">
                  <Image
                    src={getPathwayIcon(pathway.title)}
                    alt={pathway.title}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                  />
                </div>
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {pathway.title}
                    <Badge variant="secondary">
                      {pathway.documents.length} documents
                    </Badge>
                  </CardTitle>
                  <CardDescription>{pathway.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Active</Badge>
                {open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {pathway.documents.length > 0 ? (
              <div className="mt-4 space-y-3">
                <div className="text-sm font-medium text-muted-foreground border-b pb-2">
                  Documents ({pathway.documents.length})
                </div>
                {pathway.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {doc.createdAt.toLocaleDateString()}
                          </span>
                          <span>{doc.fileType.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      // onClick={() => handleDeleteDocument(doc.id, pathway.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No documents uploaded yet</p>
                <p className="text-xs mb-4">
                  Upload SRT or BTT files to get started
                </p>
                <Link
                  href="/admin/upload"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Upload Documents
                </Link>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
