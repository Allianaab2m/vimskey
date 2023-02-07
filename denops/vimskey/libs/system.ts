import { fs, path, zod } from "../deps.ts";
import xdg from "https://deno.land/x/xdg@v10.5.1/src/mod.deno.ts";

// export const browserOpen = (url: string) => {
//   switch (Deno.build.os){
//     case "linux":
//       Deno.run({ cmd: ["xdg-open", url] })
//       break
//     case "darwin":
//       Deno.run({ cmd: ["open", url] })
//       break
//     case "windows":
//       // TODO: It may not work on Windows/Mac
//       Deno.run({ cmd: ["start", url] })
//       break
//     default:
//       break
//   }
// }

export const configFile = path.join(
  xdg.config(),
  "vimskey",
  "config.json",
);

export const Config = zod.object({
  token: zod.string(),
});

const ensureSettingFiles = async () => {
  // await fs.ensureDir(path.join(xdg.data(), "vimskey"))
  await fs.ensureDir(path.join(xdg.config(), "vimskey"));
};

export const readConfig = async (): Promise<zod.infer<typeof Config>> => {
  const body = await Deno.readTextFile(configFile);
  if (!body) {
    console.log("Setted vimskey files");
    await ensureSettingFiles();
  }

  const config = Config.parse(JSON.parse(body));
  return config;
};
