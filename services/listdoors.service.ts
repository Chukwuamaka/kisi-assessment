import { getRequest } from "./default.service";

export const listDoors = (offset: number, group_id: string) => {
  return getRequest(`https://api.kisi.io/group_locks?offset=${offset}&group_id=${group_id}`)
}