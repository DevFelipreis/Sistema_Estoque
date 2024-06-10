import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRES_IN;

export const secret = jwtSecret as string;
export const expire = jwtExpire as string;
