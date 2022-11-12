import { Denops, helper, unknownutil } from "./deps.ts";
import { TimelineTypeSchema } from "./validate.ts";
import { connectToTimeline } from "./libs.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async openTimeline(timelineType: unknown): Promise<void> {
      const validatedTimelineType = (() => {
        try {
          return TimelineTypeSchema.parse(
            unknownutil.ensureString(timelineType),
          );
        } catch (_e) {
          helper.echoerr(
            denops,
            "Invalid TimelineType. Vimskey will open local Timeline.",
          );
        }
      })();
      const instanceUri = await helper.input(denops, {
        prompt: "InstanceURI:",
      });
      const token = await helper.input(denops, {
        prompt: "Token:",
      });
      if (instanceUri && token) {
        connectToTimeline(denops, instanceUri, token, validatedTimelineType);
      } else {
        return helper.echoerr(denops, "InstanceURI or Token is empty.");
      }
    },
  };

  await denops.cmd(
    `
    function! VimskeyTimelineTypeCompletion(ArgLead, CmdLine, CursorPos)
      let l:filter_cmd = printf('v:val =~ "^%s"', a:ArgLead)
      return filter(['global', 'hybrid', 'local', 'home'], l:filter_cmd)
    endfunction
    `,
  );
  await denops.cmd(
    `command! -nargs=1 -complete=customlist,VimskeyTimelineTypeCompletion VimskeyOpenTL call denops#request('${denops.name}', 'openTimeline', ['<args>'])`,
  );
}
