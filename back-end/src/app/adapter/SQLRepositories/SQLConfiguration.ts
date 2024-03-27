import { DB_CONNECTION_LIMIT, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "@resources/config";
import mysql from "mysql2/promise";

export const sqlPool: mysql.Pool = mysql.createPool({
  connectionLimit: DB_CONNECTION_LIMIT,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE
});

export async function query(sql: string, fields?: any[]): Promise<any> {
  const preparedSQL: string = fields != null && fields !== undefined ? mysql.format(sql, fields) : sql;

  const connection: mysql.PoolConnection = await sqlPool.getConnection();
  try {

    await connection.beginTransaction();

    const result: any = await connection.query(preparedSQL);

    await connection.commit();
    sqlPool.releaseConnection(connection);
    return result;
  } catch (err) {
    await connection.rollback();
    sqlPool.releaseConnection(connection);
    return Promise.reject(err);
  }

}
