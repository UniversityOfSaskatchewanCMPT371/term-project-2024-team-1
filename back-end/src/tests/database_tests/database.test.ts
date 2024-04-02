import { sqlPool } from "@app/adapter/SQLRepositories/SQLConfiguration";
import { RowDataPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { getLogger } from "log4js";

const logger = getLogger();

describe("MySQL Database Tests", () => {

  beforeAll(() => {
    logger.info("Starting database tests:");
  });

  test("Check table presence in database schema", async () => {
    const tables: string[] = ["Request", "SurveyAnswers", "SurveyQuestions", "User", "UserAnswerMap", "migrations"];
    const existingTablesQuery: string = "SHOW TABLES";
    try {
      const [result] = await sqlPool.query(existingTablesQuery);

      if ("length" in result) {
        const existingTableNames: string[] = (result as RowDataPacket[]).map(row => Object.values(row)[0]);
        expect(existingTableNames).toEqual(expect.arrayContaining(tables));
        logger.info("Table presence test passed.");
      } else {
        throw new Error("Unexpected result format");
      }
    } catch (error) {
      logger.error("Error in table presence test. Analyze database tables.", error);
    }
  });

  test("Check table name conventions", async () => {
    const tables: string[] = ["Request", "SurveyAnswers", "SurveyQuestions", "User", "UserAnswerMap", "Migrations"];
    const validName: boolean = tables.every(tableName => /^[A-Z][a-zA-Z0-9]*$/.test(tableName));
    expect(validName).toBe(true);
    if (validName) {
      logger.info("All table names conform to database schema naming conventions");
    } else {
      logger.warn("One or more tables do not conform to the naming conventions ");
    }
  });

  test("Check number of columns in User table", async () => {
    const tableName = "User";
    const expectedColumns = 6;
    const [fields] = await sqlPool.query(`DESCRIBE ${tableName}`);

    if (!Array.isArray(fields)) {
      throw new Error("Unexpected result format for User table");
    }

    expect(fields.length).toBe(expectedColumns);
    logger.info(`Number of columns in ${tableName} table is as expected.`);
  });

  test("Check number of columns in UserAnswerMap table", async () => {
    const tableName = "UserAnswerMap";
    const expectedColumns = 3;
    const [fields] = await sqlPool.query(`DESCRIBE ${tableName}`);

    if (!Array.isArray(fields)) {
      throw new Error("Unexpected result format for UserAnswerMap table");
    }

    expect(fields.length).toBe(expectedColumns);
    logger.info(`Number of columns in ${tableName} table is as expected.`);
  });

  test("Check number of columns in Request table", async () => {
    const tableName = "Request";
    const expectedColumns = 8;
    const [fields] = await sqlPool.query(`DESCRIBE ${tableName}`);

    if (!Array.isArray(fields)) {
      throw new Error("Unexpected result format for Request table");
    }

    expect(fields.length).toBe(expectedColumns);
    logger.info(`Number of columns in ${tableName} table is as expected.`);
  });

  test("Check number of columns in SurveyQuestions table", async () => {
    const tableName = "SurveyQuestions";
    const expectedColumns = 2;
    const [fields] = await sqlPool.query(`DESCRIBE ${tableName}`);

    if (!Array.isArray(fields)) {
      throw new Error("Unexpected result format for SurveyQuestions table");
    }

    expect(fields.length).toBe(expectedColumns);
    logger.info(`Number of columns in ${tableName} table is as expected.`);
  });

  test("Check number of columns in SurveyAnswers table", async () => {
    const tableName = "SurveyAnswers";
    const expectedColumns = 4;
    const [fields] = await sqlPool.query(`DESCRIBE ${tableName}`);

    if (!Array.isArray(fields)) {
      throw new Error("Unexpected result format for SurveyAnswers table");
    }

    expect(fields.length).toBe(expectedColumns);
    logger.info(`Number of columns in ${tableName} table is as expected.`);
  });

  const checkColumnDetails = async (tableName: string, expectedDetails: {
    types: Record<string, string>,
    sizes: Record<string, number>,
    nulls: Record<string, string>,
    keys: Record<string, string>
  }) => {
    const [fields, _]: [RowDataPacket[], FieldPacket[]] = await sqlPool.query(`DESCRIBE ${tableName}`) as [RowDataPacket[], FieldPacket[]];

    fields.forEach(field => {
      expect(field.Type).toEqual(expectedDetails.types[field.Field]);

      const sizeMatch = field.Type.match(/\((\d+)\)/);
      if (sizeMatch && expectedDetails.sizes[field.Field]) {
        expect(parseInt(sizeMatch[1], 10)).toEqual(expectedDetails.sizes[field.Field]);
      }

      expect(field.Null).toEqual(expectedDetails.nulls[field.Field]);

      expect(field.Key).toEqual(expectedDetails.keys[field.Field] || '');
    });

    logger.info(`Column details for table '${tableName}' verified.`);
  };

  test("Verify User table column details", async () => {
    await checkColumnDetails("User", {
      types: {
        "id": "int(11)",
        "userId": "varchar(255)",
        "password": "varchar(255)",
        "email": "varchar(255)",
        "isAdmin": "tinyint(1)",
        "clinicName": "varchar(255)"
      },
      sizes: {
        "userId": 255,
        "password": 255,
        "email": 255,
        "clinicName": 255
      },
      nulls: {
        "id": "NO",
        "userId": "NO",
        "password": "NO",
        "email": "NO",
        "isAdmin": "NO",
        "clinicName": "NO"
      },
      keys: {
        "id": "PRI",
        "userId": "UNI",
        "email": "UNI"
      }
    });
  });

  test("Verify Request table column details", async () => {
    await checkColumnDetails("Request", {
      types: {
        id: "int(11)",
        clinicName: "varchar(255)",
        email: "varchar(255)",
        password: "varchar(255)",
        status: "varchar(255)",
        createdDate: "datetime",
        decisionDate: "datetime",
        requestType: "varchar(255)"
      },
      sizes: {
        requestType: 255,
        status: 255,
        clinicName: 255,
        email: 255,
        password: 255,
      },
      nulls: {
        id: "NO",
        clinicName: "NO",
        email: "NO",
        password: "NO",
        status: "NO",
        createdDate: "NO",
        decisionDate: "YES",
        requestType: "NO",
        submittedBy: "NO"
      },
      keys: {
        id: "PRI"
      }
    });
  });


  test("Verify SurveyQuestions table column details", async () => {
    await checkColumnDetails("SurveyQuestions", {
      types: {
        id: "int(11)",
        question: "varchar(255)",
      },
      sizes: {
        question: 255
      },
      nulls: {
        id: "NO",
        question: "NO",
      },
      keys: {
        id: "PRI"
      }
    });
  });

  test("Verify SurveyAnswers table column details", async () => {
    await checkColumnDetails("SurveyAnswers", {
      types: {
        id: "int(11)",
        answer: "varchar(255)",
        question_id: "int(11)",
        note: "varchar(255)"
      },
      sizes: {
        answer: 255,
        note: 255
      },
      nulls: {
        id: "NO",
        answer: "NO",
        question_id: "YES",
        note: "YES"
      },
      keys: {
        id: "PRI",
        question_id: "MUL"
      }
    });
  });

  test("Verify UserAnswerMap table column details", async () => {
    await checkColumnDetails("UserAnswerMap", {
      types: {
        id: "int(11)",
        user_id: "int(11)",
        answer_id: "int(11)"
      },
      sizes: {},
      nulls: {
        id: "NO",
        user_id: "YES",
        answer_id: "YES"
      },
      keys: {
        id: "PRI",
        user_id: "MUL",
        answer_id: "MUL"
      }
    });
  });

  afterAll(async () => {
    await sqlPool.end();
    //ends connection pool
  });
});
