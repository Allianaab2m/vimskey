import { z } from "./deps.ts";

export const TimelineSchema = z.enum(["hybrid", "home", "local", "global"]);
export type Timeline = z.infer<typeof TimelineSchema>;

export const NoteParamSchema = z.object({
  visiblity: z.enum(["public", "home", "followers", "specified"]).default(
    "public",
  ),
  visibleUserIds: z.string().array().default([]),
  text: z.string().nullable().default(null),
  cw: z.string().nullable().default(null),
  localOnly: z.boolean().default(false),
  noExtractMentions: z.boolean().default(false),
  noExtractHashtags: z.boolean().default(false),
  noExtractEmojis: z.boolean().default(false),
  fileIds: z.string().array().optional(),
  replyId: z.string().nullable().default(null),
  renoteId: z.string().nullable().default(null),
  channelId: z.string().nullable().default(null),
  poll: z.object({
    choices: z.string().array().nonempty(),
    multiple: z.boolean().default(false),
    expiresAt: z.number().nullable(),
    expiresAfter: z.number().nullable(),
  }).nullable().default(null),
});
export type NoteParam = z.infer<typeof NoteParamSchema>;

export const UserSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  username: z.string(),
  host: z.string().nullable(),
  name: z.string(),
  onlineStatus: z.string(),
  avatarUrl: z.string(),
  avatarBlurhash: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const NoteSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  text: z.string().nullable(),
  cw: z.string().nullable(),
  user: UserSchema,
  userId: z.string(),
  visibility: z.string(),
});
export type Note = z.infer<typeof NoteSchema>;

export const BufferNoteDataSchema = z.object({
  id: z.string(),
  text: z.string(),
});

export type BufferNoteData = z.infer<typeof BufferNoteDataSchema>;
