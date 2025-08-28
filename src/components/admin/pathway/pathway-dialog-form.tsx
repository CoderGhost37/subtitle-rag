"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createPathway } from "@/actions/admin/create-pathways";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type PathwaySchemaType, pathwaySchema } from "@/schemas/pathway";

export function PathwayDialog() {
  const [isPending, startTransition] = React.useTransition();
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm<PathwaySchemaType>({
    resolver: zodResolver(pathwaySchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: PathwaySchemaType) {
    startTransition(() => {
      createPathway(values).then((res) => {
        if (res.success) {
          toast.success(res.message);
          form.reset();
          setIsOpen(false);
        } else {
          toast.error(res.message);
        }
      });
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          <span>Add Pathway</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new pathway</DialogTitle>
          <DialogDescription>
            Please fill out the form below to create a new pathway.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pathway Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Pathway Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pathway Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-40"
                      placeholder="Pathway Description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" loading={isPending}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
