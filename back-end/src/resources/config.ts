import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

// module.exports = {
//   NODE_ENV: process.env.NODE_ENV ?? "development",
//   HOST: process.env.HOST ?? "localhost",
//   PORT: process.env.PORT ?? 3000
// };

const NODE_ENV: string = process.env.NODE_ENV ?? "development";
const HOST: string = process.env.HOST ?? "localhost";
const PORT: number = process.env.PORT != null ? parseInt(process.env.PORT) : 3000;
// export function nodeEnv(): string {
//   return process.env.NODE_ENV ?? "development";
// }

// export function host(): string {
//   return process.env.HOST ?? "localhost";
// }

// export function port(): number {
//   return process.env.PORT ?? 3000;
// }

export { NODE_ENV, HOST, PORT };
