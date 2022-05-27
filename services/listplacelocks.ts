import { getRequest } from "./default.service";

export const getPlaceLocks = (place_id: number) => {
  return getRequest(`https://api.kisi.io/locks?place_id=${place_id})`)
}