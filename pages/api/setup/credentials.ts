import { setupController } from "backend/setup/setup.controller";
import { IAppliedSchemaFormConfig } from "shared/form-schemas";
import { SupportedDatabaseTypes, IDBCrendentials } from "shared/types";
import { requestHandler } from "../../../backend/lib/request";

const credentialRequestSchema: IAppliedSchemaFormConfig<IDBCrendentials> = {
  databaseType: {
    type: "selection",
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "isIn",
        constraint: {
          options: Object.values(SupportedDatabaseTypes),
        },
      },
    ],
  },
  schemaNames: {
    type: "text",
    validations: [],
  },
  database: {
    type: "text",
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  password: {
    type: "password",
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  user: {
    type: "text",
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  host: {
    type: "text",
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  port: {
    type: "number",
    validations: [
      {
        validationType: "isNumber",
      },
      {
        validationType: "postiveNumber",
      },
      {
        validationType: "max",
        constraint: {
          length: 65535,
        },
      },
    ],
  },
  ssl: {
    type: "boolean",
    validations: [
      {
        validationType: "isBoolean",
      },
    ],
  },
};

export default requestHandler(
  {
    POST: async (getValidatedRequest) => {
      const validatedRequest = await getValidatedRequest([
        {
          _type: "requestBody",
          options: credentialRequestSchema,
        },
      ]);
      return await setupController.setUpDBCredentials(
        validatedRequest.requestBody
      );
    },
  },
  [
    {
      _type: "guest",
    },
  ]
);
