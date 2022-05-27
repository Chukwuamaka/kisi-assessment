import { postRequest } from "./default.service";

export const addGroupLock = (group_lock: object) => {
  return postRequest('https://api.kisi.io/group_locks', group_lock);
}