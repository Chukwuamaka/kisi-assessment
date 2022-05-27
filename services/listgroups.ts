import { getRequest } from "./default.service";

export const listGroups = (offset: number) => {
    return getRequest(`https://api.kisi.io/groups?offset=${offset})`)
}