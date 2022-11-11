import { Denops, helper, unknownutil } from "./deps.ts";
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

    async openTimeline(timelineType: unknown): Promise<void> {
      const ensuredTlType = unknownutil.ensureString(timelineType);
      const instanceUri = await helper.input(denops, {
        prompt: "InstanceURI:",
      });
      const token = await helper.input(denops, {
        prompt: "Token:",
      });
      if (instanceUri && token) {
        switch (ensuredTlType) {
          case "global":
            connectToTimeline(denops, instanceUri, token, "globalTimeline");
            break;
          case "hybrid":
            connectToTimeline(denops, instanceUri, token, "hybridTimeline");
            break;
          case "local":
            connectToTimeline(denops, instanceUri, token, "localTimeline");
            break;
          case "home":
            connectToTimeline(denops, instanceUri, token, "homeTimeline");
            break;
          default:
            break;
        }
      } else {
        return helper.echoerr(denops, "InstanceURI or Token invalid");
      }
    },
  };

  await denops.cmd(
    `command! -nargs=0 VimskeyOpenGlobalTL call denops#request('${denops.name}', 'openTimeline', ['global'])`,
  );
  await denops.cmd(
    `command! -nargs=0 VimskeyOpenHybridTL call denops#request('${denops.name}', 'openTimeline', ['hybrid'])`,
  );
  await denops.cmd(
    `command! -nargs=0 VimskeyOpenLocalTL call denops#request('${denops.name}', 'openTimeline', ['local'])`,
  );
  await denops.cmd(
    `command! -nargs=0 VimskeyOpenHomeTL call denops#request('${denops.name}', 'openTimeline', ['home'])`,
  );
}
