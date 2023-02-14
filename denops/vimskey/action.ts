import {
  auth,
  Denops,
  dps,
  helper,
  open,
  system,
  unknownutil,
  fn,
  zod,
} from "./deps.ts";
import { connectTimeline, sendNoteReq, sendRenoteReq } from "./libs/misskey.ts";

export const actionOpenTimeline = async (
  denops: Denops,
  timelineType: unknown,
) => {
  const Timeline = zod.enum(["hybrid", "home", "local", "global"]);
  const validatedTimelineType = (() => {
    try {
      return Timeline.parse(
        unknownutil.ensureString(timelineType),
      );
    } catch (_e) {
      helper.echoerr(
        denops,
        "Invalid TimelineType. Vimskey will open local Timeline.",
      );
    }
  })();

  const credential = await system.readCredential();

  if (!credential) {
    await denops.call("denops#notify", ["vimskey", "getToken"]);
    await denops.call("denops#notify", [
      "vimskey",
      "openTimeline",
      validatedTimelineType,
    ]);
    return;
  }

  const { origin, token } = credential;

  await connectTimeline(
    denops,
    origin,
    token,
    validatedTimelineType,
  );
};

export const actionGetToken = async (denops: Denops) => {
  if (await system.readCredential()) {
    return console.log("Already authed.");
  }

  const origin = await dps.saveInput(denops, {
    type: "g",
    name: "instance#origin",
    prompt: "InstanceUrl: ",
    text: "https://",
  });
  const miauth = auth.useMiauth(origin);

  await open(miauth.authUrl());
  await dps.waitPressEnter(
    denops,
    "After authentication is complete, press enter...",
  );

  const token = await miauth.getToken();
  await system.writeCredential({ origin, token });
};

export const actionSendNote = async (denops: Denops) => {
  const credential = await system.readCredential();

  if (!credential) {
    await denops.dispatcher.getToken();
    return await denops.dispatcher.sendNote();
  }

  const noteBody = await (async () => {
    try {
      return await helper.input(denops, {
        prompt: "What you want to say? ",
      });
    } catch (_e) {
      return;
    }
  })();

  if (noteBody) {
    return await sendNoteReq({ body: noteBody });
  }
};

export const actionRenote = async (denops: Denops) => {
  const cursorText = await fn.getline(denops, '.')
  const id = cursorText.match(/(?<=<mk-id>).*(?=<\/mk-id>)/)
  if (id) {
    await sendRenoteReq(id[0])
  } else {
    return console.error("[Vimskey] Renote id not found.")
  }
}
