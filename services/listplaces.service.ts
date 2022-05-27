import { getRequest } from "./default.service";

export const getPlaces = () => {
    return getRequest('https://api.kisi.io/places');
}