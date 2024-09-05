import { BASEURL, DECODE_TOKEN, USERS } from "../../Constants";

const fetchAllUsers = async () => {
  const response = await fetch(`${BASEURL}/api/${USERS}`, {
    credentials: "include",
  });
  return response;
};

const decodeTokenAPI = async () => {
  const response = await fetch(`${BASEURL}/api/${DECODE_TOKEN}`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("failed to fetch token data");

  const result = await response.json();

  return result.data;
};

export { fetchAllUsers, decodeTokenAPI };
