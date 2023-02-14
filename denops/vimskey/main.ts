import { Denops } from "./deps.ts";
import { actionOpenTimeline, actionGetToken, actionSendNote, actionRenote } from "./action.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async openTimeline(timelineType: unknown): Promise<void> {
      await actionOpenTimeline(denops, timelineType)
    },

    async getToken() {
      await actionGetToken(denops)
    },

    async sendNote() {
      await actionSendNote(denops)
    },

    async renote() {
      await actionRenote(denops)
    }
  };

  await denops.cmd(
     `function! VimskeyTimelineTypeCompletion(ArgLead, CmdLine, CursorPos)
        let l:filter_cmd = printf('v:val =~ "^%s"', a:ArgLead)
        return filter(['global', 'hybrid', 'local', 'home'], l:filter_cmd)
      endfunction`
  )
}
