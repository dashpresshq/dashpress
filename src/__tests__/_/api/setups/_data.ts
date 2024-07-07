import { getDbConnection } from "@/backend/lib/connection/db";

interface ITestDataSchema {
  id: number;
  name: string;
  age: number;
  referenceId?: number;
  verified: boolean;
  status: "opened" | "closed" | "inprogress";
  createdAt: Date;
}

const testTable = "tests";

const DEFAULT_TEST_DATA: ITestDataSchema[] = [
  {
    age: 5,
    createdAt: new Date("2022-08-17T11:29:57.330Z"),
    id: 1,
    name: "John Doe",
    status: "closed",
    verified: true,
    referenceId: 3,
  },
  {
    age: 9,
    createdAt: new Date("2021-09-17T11:29:57.330Z"),
    id: 2,
    name: "Jane Doe",
    status: "opened",
    verified: false,
    referenceId: 5,
  },
];

export const setupTestDatabaseData = async (
  data: ITestDataSchema[] = DEFAULT_TEST_DATA
) => {
  const connection = await getDbConnection(`sqlite:./test.sqlite`);

  if (!(await connection.schema.hasTable(testTable))) {
    await connection.schema.createTable(testTable, (table) => {
      table.increments("id");
      table.integer("age");
      table.string("name");
      table.enum("status", ["opened", "closed", "inprogress"]);
      table.boolean("verified");
      table.integer("referenceId");
      table.date("createdAt");
    });
  }

  await connection(testTable).del();

  await connection(testTable).insert(data);
};
