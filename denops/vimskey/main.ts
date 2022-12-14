import { Denops, fn, helper, unknownutil, variable } from "./deps.ts";
import { BufferNoteData, NoteParamSchema, TimelineSchema } from "./validate.ts";
import {
  connectToNotification,
  connectToTimeline,
  getMiAuthToken,
  sendNoteRequest,
  tellUser,
} from "./libs.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async openTimeline(timelineType: unknown): Promise<void> {
      const validatedTimelineType = (() => {
        try {
          return TimelineSchema.parse(
            unknownutil.ensureString(timelineType),
          );
        } catch (_e) {
          helper.echoerr(
            denops,
            "Invalid TimelineType. Vimskey will open local Timeline.",
          );
        }
      })();

      const instanceUri = await tellUser(denops, "InstanceURI:", {
        variable: { name: "InstanceUri", vimType: "g" },
      });
      const token = await getMiAuthToken(denops, instanceUri);

      if (token) {
        connectToTimeline(denops, instanceUri, token, validatedTimelineType);
      }
    },

    async sendNote(text: unknown, visiblity: unknown) {
      const validatedNoteParams = (() => {
        try {
          return NoteParamSchema.parse({
            text,
            visiblity,
          });
        } catch (e) {
          console.log(e);
          helper.echoerr(denops, "text or visiblity is invalid.");
        }
      })();
      const instanceUri = await tellUser(denops, "InstanceURI:", {
        variable: { name: "InstanceUri", vimType: "g" },
      });
      const token = await getMiAuthToken(denops, instanceUri);
      console.log(validatedNoteParams);
      if (validatedNoteParams && token) {
        sendNoteRequest(instanceUri, token, validatedNoteParams);
      }
    },

    async getCursorNoteData() {
      const cursorPos = await fn.getcurpos(denops);
      const bufferLogData: Array<BufferNoteData> = JSON.parse(
        await Deno.readTextFile("/tmp/vimskeyLog.json"),
      );
      // console.log(bufferLogData[cursorPos[1] - 1].id);
      variable.w.set(
        denops,
        "VimskeyCopiedNoteId",
        bufferLogData[cursorPos[1] - 1].id,
      );
    },

    async openNotification() {
      const instanceUri = await tellUser(denops, "InstanceURI:", {
        variable: { name: "InstanceUri", vimType: "g" },
      });
      const token = await getMiAuthToken(denops, instanceUri);
      if (token) {
        connectToNotification(denops, instanceUri, token);
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
    `command! -nargs=0 VimskeyNotification call denops#request('${denops.name}', 'openNotification', [])`,
  );

  await denops.cmd(
    `command! -nargs=1 -complete=customlist,VimskeyTimelineTypeCompletion VimskeyOpenTL call denops#request('${denops.name}', 'openTimeline', ['<args>'])`,
  );

  await denops.cmd(
    `command! -nargs=+ VimskeyNoteFromCmdline call denops#request('${denops.name}', 'sendNote', [<args>])`,
  );
}
