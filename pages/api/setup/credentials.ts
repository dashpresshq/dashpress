import {
  IDBCrendentials,
  SupportedDatabaseTypes,
} from "backend/credentials/crendential.types";
import { setupController } from "backend/setup/setup.controller";
import { IRequestValidation } from "shared/validations/makeRequestValidationRunnable";
import { requestHandler } from "../../../backend/lib/request";

const credentialRequestSchema: IRequestValidation<IDBCrendentials> = {
  databaseType: {
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
    validations: [],
  },
  database: {
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  password: {
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  user: {
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  host: {
    validations: [
      {
        validationType: "isString",
      },
    ],
  },
  port: {
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
