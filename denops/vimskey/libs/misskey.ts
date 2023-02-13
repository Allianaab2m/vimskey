import { Denops, Misskey } from "../deps.ts";
import { buffer, vars } from "../deps.ts";
import { zod } from "../deps.ts";
import { system } from "../deps.ts"

type Visibility = "home" | "public" | "followers" | "specified";

// ref: https://github.com/ansanloms/denops-misskey/blob/f648207b1ceccadb0234f25991f5fcdefd6d68c8/denops/misskey/template.ts
export const noteTemplate = (n: Misskey.entities.Note, prefix?: string) => {
  const template: string[] = [];

  const sep = " │ ";
  const icon = n.user.isCat ? "🐱" : (n.user.isBot ? "🤖" : "👤");

  template.push(
    `<mk-name>${icon} ${n.user.name || ""}</mk-name> ` +
      `<mk-username>@${n.user.username}</mk-username>` +
      (n.user.host ? `<mk-host>@n.user.host</mk-host>` : ""),
  );
  template.push("");

  if (n.text) {
    template.push(
      ...`${n.text || ""}`.split("\n").map((v) => `  ${v}`),
    );
    template.push("");
  }

  if (n.renote) {
    template.push(...noteTemplate(n.renote, `${prefix || ""} ${sep}`));
    template.push("");
  }

  if (template.at(-1) === "") {
    template.pop();
  }

  return template.map((v) => `${prefix || ""}${v}`);
};
// refend thanks!

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

export const connectTimeline = async (
  denops: Denops,
  origin: string,
  token: string,
  timelineType: zod.infer<typeof Timeline> = "hybrid",
) => {
  const stream = new Misskey.Stream(origin, { token });
  const channel = stream.useChannel(`${timelineType}Timeline`);
  const tlBuffer = await buffer.open(
    denops,
    `vimskey://${origin}/${timelineType}TL`,
  );
  await denops.cmd(`setlocal ft=vimskey-timeline buftype=acwrite conceallevel=3`)


  channel.on("note", async (n) => {
    if (n.text) {
      // ref: https://github.com/ansanloms/denops-misskey/blob/f648207b1ceccadb0234f25991f5fcdefd6d68c8/denops/misskey/main.ts#L59-L73
      const bufnr = tlBuffer.bufnr
      const line = Number(await denops.call("line", "."))
      await denops.call("appendbufline", bufnr, 0, [
        "",
        ...noteTemplate(n),
        "",
      ])

      if (bufnr === (await denops.call("bufnr", "%"))) {
        if (line === 1) {
          await denops.cmd("1")
        }
        await denops.cmd("redraw")
      }
      // refend thanks!
    }
  });
};
