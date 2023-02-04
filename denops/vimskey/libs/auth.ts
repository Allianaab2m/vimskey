import { MiAuth, UrlParam, Permissions } from "../deps.ts"

export const useMiauth = (origin: string) => {
  const param: UrlParam = {
    name: "Vimskey",
    permission: [
      Permissions.NotesWrite,
      Permissions.AccountRead,
      Permissions.AccountWrite,
      Permissions.NotesRead,
      Permissions.BlocksRead,
      Permissions.BlocksWrite,
      Permissions.FavoritesRead,
      Permissions.FavoritesWrite,
      Permissions.FollowingRead,
      Permissions.FollowingWrite,
      Permissions.MessagingRead,
      Permissions.messagingWrite,
      Permissions.MutesRead,
      Permissions.MutesWrite,
      Permissions.NotificationsRead,
      Permissions.NotificationsWrite,
    ]
  } 
  const session = crypto.randomUUID()

  const miauth = new MiAuth(origin, param, session)

  return miauth
}

