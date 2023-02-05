// import { Denops, fn, helper, unknownutil, variable } from "./deps.ts";
// import { BufferNoteData, NoteParamSchema, TimelineSchema } from "./validate.ts";
// import {
//   connectToNotification,
//   connectToTimeline,
//   getMiAuthToken,
//   sendNoteRequest,
//   tellUser,
// } from "./libs.ts";
import { Denops, helper } from "./deps.ts"
import { auth, dps } from "./deps.ts"
import { system } from "./deps.ts"
import { sendNoteReq } from "./libs/misskey.ts"
import { getVimValue } from "./libs/denops.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    // async openTimeline(timelineType: unknown): Promise<void> {
    //   const validatedTimelineType = (() => {
    //     try {
    //       return TimelineSchema.parse(
    //         unknownutil.ensureString(timelineType),
    //       );
    //     } catch (_e) {
    //       helper.echoerr(
    //         denops,
    //         "Invalid TimelineType. Vimskey will open local Timeline.",
    //       );
    //     }
    //   })();
    //
    //   const instanceUri = await tellUser(denops, "InstanceURI:", {
    //     variable: { name: "InstanceUri", vimType: "g" },
    //   });
    //   const token = await getMiAuthToken(denops, instanceUri);
    //
    //   if (token) {
    //     connectToTimeline(denops, instanceUri, token, validatedTimelineType);
    //   }
    // },

    // async sendNote(text: unknown, visiblity: unknown) {
    //   const validatedNoteParams = (() => {
    //     try {
    //       return NoteParamSchema.parse({
    //         text,
    //         visiblity,
    //       });
    //     } catch (e) {
    //       console.log(e);
    //       helper.echoerr(denops, "text or visiblity is invalid.");
    //     }
    //   })();
    //   const instanceUri = await tellUser(denops, "InstanceURI:", {
    //     variable: { name: "InstanceUri", vimType: "g" },
    //   });
    //   const token = await getMiAuthToken(denops, instanceUri);
    //   console.log(validatedNoteParams);
    //   if (validatedNoteParams && token) {
    //     sendNoteRequest(instanceUri, token, validatedNoteParams);
    //   }
    // },
    //
    // async getCursorNoteData() {
    //   const cursorPos = await fn.getcurpos(denops);
    //   const bufferLogData: Array<BufferNoteData> = JSON.parse(
    //     await Deno.readTextFile("/tmp/vimskeyLog.json"),
    //   );
    //   // console.log(bufferLogData[cursorPos[1] - 1].id);
    //   variable.w.set(
    //     denops,
    //     "VimskeyCopiedNoteId",
    //     bufferLogData[cursorPos[1] - 1].id,
    //   );
    // },
    //
    // async openNotification() {
    //   const instanceUri = await tellUser(denops, "InstanceURI:", {
    //     variable: { name: "InstanceUri", vimType: "g" },
    //   });
    //   const token = await getMiAuthToken(denops, instanceUri);
    //   if (token) {
    //     connectToNotification(denops, instanceUri, token);
    //   }
    // },
    async getToken() {
      if (await getVimValue(denops, { type: "g", name: "token" })) return console.log("Already authed.")
      const origin = await dps.saveInput(denops, { type: "g", name: "instance#origin", prompt: "InstanceUrl: " })
      const miauth = auth.useMiauth(origin)

      console.log(`Auth URL: ${miauth.authUrl()}`)
      system.browserOpen(miauth.authUrl())
      await dps.waitPressEnter(denops, "After authentication is complete, press enter...")

      await dps.setVimValue(denops, { type: "g", name: "token", value: await miauth.getToken() })
    },

    async sendNote() {
      const token = await getVimValue(denops, { type: "g", name: "token" }) 
      if (token === null) {
        await denops.dispatcher.getToken()
        await denops.dispatcher.sendNote()
      }
      
      const noteBody = await helper.input(denops, {
        prompt: "What you want to say? "
      })

      if (noteBody) {
        return await sendNoteReq(denops, { body: noteBody })
      } else {
        throw "[User input]Note body is empty"
      }
    }
  };

  await denops.cmd(
    `command! -nargs=0 VimskeyAuth call denops#request('${denops.name}', 'getToken', [])`
  )

  await denops.cmd(
    `command! -nargs=0 VimskeyNote call denops#request('${denops.name}', 'sendNote', [])`
  )

  // await denops.cmd(
  //   `
  //   function! VimskeyTimelineTypeCompletion(ArgLead, CmdLine, CursorPos)
  //     let l:filter_cmd = printf('v:val =~ "^%s"', a:ArgLead)
  //     return filter(['global', 'hybrid', 'local', 'home'], l:filter_cmd)
  //   endfunction
  //   `,
  // );
  //
  // await denops.cmd(
  //   `command! -nargs=0 VimskeyNotification call denops#request('${denops.name}', 'openNotification', [])`,
  // );
  //
  // await denops.cmd(
  //   `command! -nargs=1 -complete=customlist,VimskeyTimelineTypeCompletion VimskeyOpenTL call denops#request('${denops.name}', 'openTimeline', ['<args>'])`,
  // );
  //
  // await denops.cmd(
  //   `command! -nargs=+ VimskeyNoteFromCmdline call denops#request('${denops.name}', 'sendNote', [<args>])`,
  // );
}
