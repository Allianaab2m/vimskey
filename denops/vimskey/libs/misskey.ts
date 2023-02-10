import { Denops, Misskey } from "../deps.ts";
import { buffer, fn } from "../deps.ts";
import { zod } from "../deps.ts";
import { system } from "../deps.ts"

type Visibility = "home" | "public" | "followers" | "specified";

export const sendNoteReq = async (
  params: { visibility?: Visibility; body: string },
) => {
  const credential = await system.readCredential()
  if (!credential) throw "[Vimskey] Auth not found";
  const { origin, token } = credential

  const client = new Misskey.api.APIClient({ origin, credential: token });

  const visibility = params.visibility ? params.visibility : "public";

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

// export const connectTimeline = async (
//   denops: Denops,
//   instanceUri: string,
//   token: string,
//   timelineType: zod.infer<typeof Timeline> = "local",
// ) => {
//   const stream = new Misskey.Stream(instanceUri, { token })
//   const channel = stream.useChannel(`${timelineType}Timeline`)
//   const tlData: Array<zod.infer<typeof BufferNote>> = []
//   const tlbuffer = await buffer.open(denops, `vimskey://${timelineType}TL`)
//   channel.on("note", async (note) => {
//     if (note.text) {
//       const bufferText = `${note.user.name}(${note.user.username}): ${note.text}`
//       await fn.appendbufline(denops, tlbuffer.bufnr, 0, bufferText)
//     }
//   })
// }

export const connectTimeline = async (
  denops: Denops,
  instanceUri: string,
  token: string,
  timelineType: zod.infer<typeof Timeline> = "hybrid",
) => {
  const stream = new Misskey.Stream(instanceUri, { token });
  const channel = stream.useChannel(`${timelineType}Timeline`);
  const tlBuffer = await buffer.open(
    denops,
    `vimskey://${instanceUri}/${timelineType}TL`,
  );
  channel.on("note", async (n) => {
    if (n.text) {
      const bufferText = `${n.user.name}(@${n.user.username}): ${n.text}`;
      await buffer.modifiable(denops, tlBuffer.bufnr, async () => {
        await fn.appendbufline(denops, tlBuffer.bufnr, 0, bufferText);
      });
    }
  });
};
