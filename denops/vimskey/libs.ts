import { TimelineType } from "./validate.ts";
import { buffer, Denops, Misskey, z } from "./deps.ts";

export const connectToTimeline = async (
  denops: Denops,
  instanceUri: string,
  token: string,
  timelineType: TimelineType = "local",
) => {
  const stream = new Misskey.Stream(instanceUri, { token });
  const channel = stream.useChannel(`${timelineType}Timeline`);
  const timelineText: Array<string> = [];
  const tlbuffer = await buffer.open(denops, `vimskey://${timelineType}TL`);
  channel.on("note", async (note) => {
    if (note.text) {
      const bufferText =
        `${note.user.name}(${note.user.username}): ${note.text}`;
      timelineText.unshift(bufferText);
      await buffer.replace(denops, tlbuffer.bufnr, timelineText);
    }
  });
};
