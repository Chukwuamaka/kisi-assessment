import { postRequest } from "./default.service";

export const login = (user: object) => {
    return postRequest(`https://api.kisi.io/logins`, user)
}