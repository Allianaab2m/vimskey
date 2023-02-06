import { Denops } from "../deps.ts";
import { variable } from "../deps.ts";
import { helper } from "../deps.ts";

export const waitPressEnter = async (denops: Denops, promptText: string) => {
  await helper.input(denops, {
    prompt: promptText,
  });
};

// もしVim変数に無いときはユーザーに入力を促す
export const saveInput = async (denops: Denops, params: {
  type: keyof typeof variable;
  name: string;
  prompt?: string;
  text?: string;
}) => {
  const vimValue = await getVimValue(denops, {
    type: params.type,
    name: params.type,
  });

  if (vimValue) {
    return vimValue;
  }

  const userInput = await helper.input(denops, {
    prompt: params.prompt,
    text: params.text,
  });

  if (userInput) {
    await setVimValue(denops, {
      type: params.type,
      name: params.name,
      value: userInput,
    });
    return userInput;
  } else {
    throw "User input canceled";
  }
};

export const setVimValue = async (denops: Denops, params: {
  type: keyof typeof variable;
  name: string;
  value: string;
}) => {
  await variable[params.type].set(
    denops,
    `vimskey#${params.name}`,
    params.value,
  );
};

export const getVimValue = async (denops: Denops, params: {
  type: keyof typeof variable;
  name: string;
}) => {
  const vimValue = await variable[params.type].get<string>(
    denops,
    `vimskey#${params.name}`,
  );
  // TODO: debug mode
  // console.log(`${params.name}: ${vimValue}`)
  return vimValue;
};
