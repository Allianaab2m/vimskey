import { Denops, Misskey } from "../deps.ts";
import { buffer, fn } from "../deps.ts"
import { zod } from "../deps.ts"
import { getVimValue } from "./denops.ts";

type Visibility = "home" | "public" | "followers" | "specified";

export const sendNoteReq = async (
  denops: Denops,
  params: { visibility?: Visibility; body: string },
) => {
  const origin = await getVimValue(denops, {
    type: "g",
    name: "instance#origin",
  });
  const token = await getVimValue(denops, { type: "g", name: "token" });
  if (origin === null || token === null) throw "[Vimskey] Auth not found";

  const client = new Misskey.api.APIClient({ origin, credential: token });

  const visibility = params.visibility ? params.visibility : "home";

  try {
    await client.request("notes/create", { visibility, text: params.body });
  } catch (e) {
    console.error(e);
    throw "[Misskey api] notes/create error";
  }
};

const Timeline = zod.enum(["hybrid", "home", "local", "global"]);
const BufferNote = zod.object({
  id: zod.string(),
  text: zod.string(),
});

export const connectTimeline = async (
  denops: Denops,
  instanceUri: string,
  token: string,
  timelineType: zod.infer<typeof Timeline> = "local",
) => {
  const stream = new Misskey.Stream(instanceUri, { token })
  const channel = stream.useChannel(`${timelineType}Timeline`)
  const tlData: Array<zod.infer<typeof BufferNote>> = []
  const tlbuffer = await buffer.open(denops, `vimskey://${timelineType}TL`)
  channel.on("note", async (note: Note) => {
    if (note.text) {
      const bufferText = `${note.user.name}(${note.user.username}): ${note.text}`
      await fn.appendbufline(denops, tlbuffer, 0, bufferText)
    }
  })
}
