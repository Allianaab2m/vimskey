import { BufferNoteData, Note, NoteParam, Timeline } from "./validate.ts";
import { buffer, Denops, helper, Misskey, variable } from "./deps.ts";

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
