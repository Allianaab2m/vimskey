import { z } from "./deps.ts";

export const TimelineTypeSchema = z.enum(["hybrid", "home", "local", "global"]);
export type TimelineType = z.infer<typeof TimelineTypeSchema>;

export const NoteParamTypeSchema = z.object({
  visiblity: z.enum(["public", "home", "followers", "specified"]).default(
    "public",
  ),
  visibleUserIds: z.string().array().default([]),
  text: z.string().nullable(),
  cw: z.string().nullable(),
  localOnly: z.boolean().default(false),
  noExtractMentions: z.boolean().default(false),
  noExtractHashtgs: z.boolean().default(false),
  noExtractEmojis: z.boolean().default(false),
  fileIds: z.string().array().default([]),
  mediaIds: z.string().array().default([]),
  replyId: z.string().nullable(),
  renoteId: z.string().nullable(),
  channelId: z.string().nullable(),
  poll: z.object({
    choices: z.string().array().nonempty(),
    multiple: z.boolean().default(false),
    expiresAt: z.number().nullable(),
    expiresAfter: z.number().nullable(),
  }).nullable(),
});
export type NoteParamType = z.infer<typeof NoteParamTypeSchema>;
