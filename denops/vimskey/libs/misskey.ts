import { Denops, Misskey } from "../deps.ts";
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
