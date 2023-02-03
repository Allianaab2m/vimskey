export const browserOpen = (url: string) => {
  switch (Deno.build.os){
    case "linux":
      Deno.run({ cmd: ["xdg-open", url] })
      break
    case "darwin":
      Deno.run({ cmd: ["open", url] })
      break
    case "windows":
      // TODO: It may not work on Windows/Mac
      Deno.run({ cmd: ["start", url] })
      break
    default:
      break
  }
}
