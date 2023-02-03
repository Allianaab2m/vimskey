import { MiAuth, UrlParam, Permissions } from "../deps.ts"

export const useMiauth = (origin: string) => {
  const param: UrlParam = {
    name: "Vimskey",
    permission: [ Permissions.AccountRead ]
  } 
  const session = crypto.randomUUID()

  const miauth = new MiAuth(origin, param, session)

  return miauth
}

