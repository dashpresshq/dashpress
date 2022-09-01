interface ITestDataSchema {
  name: string;
  age: number;
  verified: boolean;
  status: "opened" | "closed" | "inprogres";
}

export const setupTestDatabaseData = async (data: ITestDataSchema[]) => {
  return data;
  // Check the schema exist else create
  // Delete all the data in the code base
  // Then bulkInsert this ones
};
