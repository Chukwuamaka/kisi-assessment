import { deleteRequest } from "./default.service";

export const deleteGroupLock = (id: number) => {
  return deleteRequest(`https://api.kisi.io/group_locks/${id}`);
}