import { Denops, helper } from "./deps.ts";
import { connectToTimeline } from "./libs.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async boot(): Promise<void> {
      const instanceUri = await helper.input(denops, {
        prompt: "InstanceURI:",
      });
      const token = await helper.input(denops, {
        prompt: "Token:",
      });
      if (instanceUri && token) {
        return connectToTimeline(denops, instanceUri, token, "hybridTimeline");
      } else {
        return;
      }
    },
  };

  await denops.cmd(
    `command! -nargs=0 Vimskey call denops#request('${denops.name}', 'boot', [])`,
  );
}
