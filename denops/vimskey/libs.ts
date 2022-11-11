import { buffer, Denops, Misskey } from "./deps.ts";

type TimelineType =
  | "hybridTimeline"
  | "homeTimeline"
  | "localTimeline"
  | "globalTimeline";

export const connectToTimeline = async (
  denops: Denops,
  instanceUri: string,
  token: string,
  timelineType: TimelineType,
) => {
  const stream = new Misskey.Stream(instanceUri, { token });
  const channel = stream.useChannel(timelineType);
  const timelineText: Array<string> = [];
  const tlbuffer = await buffer.open(denops, "vimskey://localtimeline");
  channel.on("note", async (note) => {
    if (note.text) {
      const bufferText =
        `${note.user.name}(${note.user.username}): ${note.text}`;
      timelineText.unshift(bufferText);
      await buffer.replace(denops, tlbuffer.bufnr, timelineText);
    }
  });
};
