import {
  BufferNoteData,
  Note,
  NoteParam,
  Renote,
  Timeline,
  User,
} from "./validate.ts";
import { buffer, Denops, helper, MiAuth, Misskey, variable } from "./deps.ts";

export const tellUser = async (denops: Denops, prompt: string, opt: {
  variable?: {
    vimType: keyof typeof variable;
    name: string;
  };
}) => {
  if (opt.variable) {
    const vimVal = await variable[opt.variable.vimType].get<string>(
      denops,
      `Vimskey${opt.variable.name}`,
    );
    if (vimVal) {
      return vimVal;
    }
  }

  const userInput = await helper.input(denops, {
    prompt: prompt,
  });

  if (userInput) {
    if (opt.variable) {
      await variable[opt.variable.vimType].set(
        denops,
        `Vimskey${opt.variable.name}`,
        userInput,
      );
    }
    return userInput;
  } else {
    throw "Userinput is empty";
  }
};

export const getMiAuthToken = async (denops: Denops, instanceUri: string) => {
  const vimVal = await variable.g.get<string>(
    denops,
    "VimskeyToken",
  );
  if (vimVal) {
    return vimVal;
  }

  const p = MiAuth.Permissions;
  const param: MiAuth.UrlParam = {
    name: "Vimskey",
    permission: [
      p.AccountRead,
      p.AccountWrite,
      p.NotesRead,
      p.NotesWrite,
      p.BlocksRead,
      p.BlocksWrite,
      p.FavoritesRead,
      p.FavoritesWrite,
      p.FollowingRead,
      p.FollowingWrite,
      p.MessagingRead,
      p.messagingWrite,
      p.MutesRead,
      p.MutesWrite,
      p.NotificationsRead,
      p.NotificationsWrite,
    ],
  };
  const session = crypto.randomUUID();

  const miauth = new MiAuth.MiAuth(instanceUri, param, session);

  await helper.echo(denops, "Go to your launched browser.");
  Deno.run({
    cmd: ["xdg-open", miauth.authUrl()],
  });

  await helper.input(denops, {
    text: "After authentication is complete, press enter...",
  });

  const token = await miauth.getToken().catch((e) => console.log(e));

  if (token) {
    await variable.g.set(denops, "VimskeyToken", token);
    return token;
  } else {
    return null;
  }
};

export const connectToTimeline = async (
  denops: Denops,
  instanceUri: string,
  token: string,
  timelineType: Timeline = "local",
) => {
  const stream = new Misskey.Stream(instanceUri, { token });
  const channel = stream.useChannel(`${timelineType}Timeline`);
  const timelineData: Array<BufferNoteData> = [];
  const tlbuffer = await buffer.open(denops, `vimskey://${timelineType}TL`);
  channel.on("note", async (note: Note) => {
    if (note.text) {
      const bufferText =
        `${note.user.name}(${note.user.username}): ${note.text}`;
      timelineData.unshift({ id: note.id, text: bufferText });
      await buffer.replace(
        denops,
        tlbuffer.bufnr,
        timelineData.map((v) => v.text),
      );
      await Deno.writeTextFile(
        "/tmp/vimskeyLog.json",
        JSON.stringify(timelineData),
      );
    }
  });
};

export const connectToNotification = (
  denops: Denops,
  instanceUri: string,
  token: string,
) => {
  const stream = new Misskey.Stream(instanceUri, { token });
  const channel = stream.useChannel("main");
  channel.on("reply", (note: Note) => {
    const notifText = `[Vimskey] Replied from ${note.user.name}: ${note.text}`;
    desktopNotify(denops, notifText);
  });
  channel.on("renote", (note: Renote) => {
    console.log(note.renote.text);
    const notifText =
      `[Vimskey] Renoted from ${note.user.name}: ${note.renote.text}`;
    desktopNotify(denops, notifText);
  });
  channel.on("followed", (user: User) => {
    const notifText = `[Vimskey] Followed from ${user.name}`;
    desktopNotify(denops, notifText);
  });
};

export const desktopNotify = (denops: Denops, text: string) => {
  helper.echo(denops, text);
  Deno.run({
    cmd: ["notify-send", text],
  });
};

export const sendNoteRequest = async (
  instanceUri: string,
  token: string,
  noteParams: NoteParam,
) => {
  const client = new Misskey.api.APIClient({
    origin: instanceUri,
    credential: token,
  });
  await client.request("notes/create", noteParams);
};
