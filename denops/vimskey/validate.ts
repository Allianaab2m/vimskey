import { z } from "./deps.ts";

export const TimelineTypeSchema = z.enum(["hybrid", "home", "local", "global"]);
export type TimelineType = z.infer<typeof TimelineTypeSchema>;
