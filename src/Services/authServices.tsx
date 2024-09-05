import { BASEURL, SIGN_UP, SIGN_IN } from "../../Constants";

const signUpService = async (data: { [key: string]: string }) => {
  const response = await fetch(`${BASEURL}/api/${SIGN_UP}`, {
    body: JSON.stringify(data),
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

const signInService = async (data: { [key: string]: string }) => {
  const response = await fetch(`${BASEURL}/api/${SIGN_IN}`, {
    body: JSON.stringify(data),
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Could not sign in");
  }

  return response;
};

export { signUpService, signInService };
