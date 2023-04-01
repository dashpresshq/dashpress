import { setupApiController } from "backend/setup/setup.controller";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import {
  DATA_SOURCES_CONFIG,
  IDataSourceCredentials,
} from "shared/types/data-sources";
import { requestHandler } from "../../../backend/lib/request";

const credentialRequestSchema: IAppliedSchemaFormConfig<IDataSourceCredentials> =
  {
    dataSourceType: {
      type: "selection",
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "isIn",
          constraint: {
            options: Object.keys(DATA_SOURCES_CONFIG),
          },
        },
      ],
    },
    connectionString: {
      type: "text",
      validations: [
        {
          validationType: "isString",
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
            value: 65535,
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
    filename: {
      type: "text",
      validations: [
        {
          validationType: "isString",
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
      return await setupApiController.setUpDBCredentials(
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
