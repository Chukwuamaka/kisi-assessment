export const getRequest = (url: string) => {
  return fetch(url, {
    headers: {
      Authorization: `KISI-LOGIN ${process.env.NEXT_PUBLIC_API_KEY}`,
    }
  });
};

export const postRequest = (url: string, data: object) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `KISI-LOGIN ${process.env.NEXT_PUBLIC_API_KEY}`
    },
    body: JSON.stringify(data)
  });
};