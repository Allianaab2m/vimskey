import { path, zod } from "../deps.ts";
import xdg from "https://deno.land/x/xdg@v10.5.1/src/mod.deno.ts";
import { ensureFile } from "./utils.ts";

export const configFile = path.join(
  xdg.config(),
  "vimskey",
  "config.json",
);

export const credentialFile = path.join(
  xdg.data(),
  "vimskey",
  "credentials.json"
)

export const Config = zod.object({
  timeline: zod.enum(["hybrid", "home", "local", "global"]),
  visibility: zod.enum(["public", "home", "followers"]),
});

export const Credential = zod.object({
    origin: zod.string().url(),
    token: zod.string(),
});

const readMetaFile = async (file: string) => {
  await ensureFile(file);
  const body = await Deno.readTextFile(file);
  if (!body) {
    console.log(`[Vimskey] created ${file}`)
    await Deno.writeTextFile(file, "{}")
    return await Deno.readTextFile(file)
  } else {
    return body
  }
};

export const readConfig = async (): Promise<zod.infer<typeof Config>> => {
  const body = await readMetaFile(configFile)
  return Config.parse(JSON.parse(body));
};

export const writeConfig = async (params: zod.infer<typeof Config>) => {
  const config = { ...Config.parse(await readMetaFile(configFile)), ...params }
  await Deno.writeTextFile(configFile, JSON.stringify(config))
}

export const readCredential = async (): Promise<zod.infer<typeof Credential> | null> => {
  const body = await readMetaFile(credentialFile)
  if (body == "{}") {
    return null
  }
  return Credential.parse(JSON.parse(body))
}

export const writeCredential = async (params: zod.infer<typeof Credential>) => {
  await Deno.writeTextFile(credentialFile, JSON.stringify(params))
}
