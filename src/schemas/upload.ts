import z from "zod";

export const uploadSchema = z.object({
  pathwayId: z.string().cuid(),
  files: z
    .array(
      z
        .file()
        .refine(
          (file) =>
            ["application/x-subrip", "text/vtt"].includes(file.type) ||
            file.name.toLowerCase().endsWith(".srt") ||
            file.name.toLowerCase().endsWith(".vtt"),
          {
            message: "Only .srt and .vtt files are allowed",
          },
        ),
    )
    .min(1),
});

export type UploadSchemaType = z.infer<typeof uploadSchema>;
