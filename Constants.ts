const BASEURL =
  import.meta.env.VITE_PROD_SERVER_URL || import.meta.env.VITE_DEV_SERVER_URL;
const SIGN_OUT = "sign-out";
const SIGN_IN = "sign-in";
const SIGN_UP = "sign-up";
const USERS = "users";
const DECODE_TOKEN = "decode-token";

export { SIGN_IN, SIGN_OUT, SIGN_UP, BASEURL, USERS, DECODE_TOKEN };
