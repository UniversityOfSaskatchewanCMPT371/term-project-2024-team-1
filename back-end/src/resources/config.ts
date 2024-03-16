import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

console.log(path.resolve(__dirname, `${process.env.NODE_ENV}.env`));

const NODE_ENV: string = process.env.NODE_ENV ?? "development";
const HOST: string = process.env.HOST ?? "localhost";
const PORT: number = process.env.PORT != null ? parseInt(process.env.PORT) : 3000;

const DB_PORT: number = process.env.DB_PORT != null ? parseInt(process.env.DB_PORT) : 3306;
const DB_HOST: string = process.env.DB_HOST ?? "localhost";
const DB_USER: string = process.env.DB_USER ?? "root";
const DB_PASSWORD: string = process.env.DB_PASSWORD ?? "";
const DB_CONNECTION_LIMIT: number = process.env.DB_CONNECTION_LIMIT != null ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10;
const DB_DATABASE: string = process.env.DB_DATABASE ?? "test";
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET ?? "ACCESS_CMPT371";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET ?? "REFRESH_CMPT371";

export { NODE_ENV, HOST, PORT, DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_CONNECTION_LIMIT, DB_DATABASE, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
