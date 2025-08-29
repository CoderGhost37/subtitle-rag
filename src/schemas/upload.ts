import z from "zod";

export const uploadSchema = z.object({
  pathwayId: z.string().cuid(),
  files: z
    .array(
      z
        .instanceof(File, { message: "Invalid file" })
        .refine(
          (file) =>
            [".srt", ".vtt"].some((ext) =>
              file.name.toLowerCase().endsWith(ext),
            ),
          { message: "Only .srt and .vtt files are allowed" },
        )
        .refine((file) => file.size <= 50 * 1024 * 1024, {
          message: "File size must be less than 50MB",
        }),
    )
    .nonempty({ message: "Please upload at least one subtitle file" }),
});

export type UploadSchemaType = z.infer<typeof uploadSchema>;
