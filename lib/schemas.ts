import { z } from "zod";

export const createRequestSchema = z.object({
  title: z
    .string()
    .min(5, "Title is required")
    .max(100, "Title max 100 characters"),
  description: z
    .string()
    .min(5, "Description is required")
    .max(1000, "Description max 1000 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  dueDate: z.string().nullable().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updateRequestSchema = z.object({
  title: z
    .string()
    .min(5, "Title is required")
    .max(100, "Title max 100 characters"),
  description: z
    .string()
    .min(5, "Description is required")
    .max(1000, "Description max 1000 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  dueDate: z.string().nullable().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "SUBMITTED", "DONE"]),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
