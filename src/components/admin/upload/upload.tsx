"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import type { PathwayBasicInfoType } from "@/actions/admin/get-pathways-basic-info";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UploadSchemaType, uploadSchema } from "@/schemas/upload";
import { getPathwayIcon } from "@/utils/getPathwayIcon";

export function UploadForm({ pathways }: { pathways: PathwayBasicInfoType[] }) {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<UploadSchemaType>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      pathwayId: "",
      files: [],
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const prevFiles = form.getValues("files");
    if (acceptedFiles?.length > 0) {
      form.setValue("files", [...prevFiles, ...acceptedFiles], {
        shouldValidate: true,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/x-subrip": [".srt"],
      "text/vtt": [".vtt"],
    },
    maxSize: 50 * 1024 * 1024,
    multiple: true,
  });

  const _formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  };

  const handleDelete = (fileName: string) => {
    const prevFiles = form.getValues("files");
    form.setValue(
      "files",
      prevFiles.filter((file) => file.name !== fileName),
      { shouldValidate: true },
    );
  };

  function onSubmit(_values: UploadSchemaType) {
    startTransition(() => {
      //   createPathway(values).then((res) => {
      //     if (res.success) {
      //       toast.success(res.message);
      //       form.reset();
      //       setIsOpen(false);
      //     } else {
      //       toast.error(res.message);
      //     }
      //   });
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Upload SRT or BTT files to add content to your learning pathways.
            Files will be automatically processed for RAG AI responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="pathwayId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pathway</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pathway" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pathways.map((pathway) => (
                          <SelectItem key={pathway.id} value={pathway.id}>
                            <div className="flex items-center gap-2">
                              <span>
                                <Image
                                  src={getPathwayIcon(pathway.title)}
                                  alt={pathway.title}
                                  width={24}
                                  height={24}
                                />
                              </span>
                              {pathway.title}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={() => (
                  <FormItem>
                    <FormLabel>Files</FormLabel>
                    <FormControl>
                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-accent min-h-20"
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p className="text-muted-foreground">
                            Drop the file here...
                          </p>
                        ) : (
                          <p className="text-muted-foreground">
                            Drag & drop a SRT or VTT file here, or click to
                            select.
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" loading={isPending}>
                  Upload & Process {form.getValues("files").length} Files
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Selected Files
          </CardTitle>
          <CardDescription>Files you have selected for upload</CardDescription>
        </CardHeader>
        <CardContent>
          {form.getValues("files").length === 0 ? (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                No documents uploaded yet. Use the upload form above to add your
                first document.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {form.getValues("files").map((document) => (
                <div
                  key={document.name}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{document.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="uppercase">
                      {document.type}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(document.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
