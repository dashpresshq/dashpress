import { setupApiService } from "backend/setup/setup.service";
import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import type { IDataSourceCredentials } from "shared/types/data-sources";
import { DATA_SOURCES_CONFIG } from "shared/types/data-sources";
import { requestHandler } from "backend/lib/request";
import { typescriptSafeObjectDotKeys } from "shared/lib/objects";
import { fakeMessageDescriptor } from "translations/fake";

const credentialRequestSchema: IAppliedSchemaFormConfig<IDataSourceCredentials> =
  {
    dataSourceType: {
      label: fakeMessageDescriptor("dataSourceType"),

      type: "selection",
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "isIn",
          constraint: {
            options: typescriptSafeObjectDotKeys(DATA_SOURCES_CONFIG),
          },
        },
      ],
    },
    connectionString: {
      label: fakeMessageDescriptor("connectionString"),

      type: "text",
      validations: [
        {
          validationType: "isString",
        },
      ],
    },
    schemaNames: {
      label: fakeMessageDescriptor("schemaNames"),

      type: "text",
      validations: [],
    },
    database: {
      label: fakeMessageDescriptor("database"),

      type: "text",
      validations: [
        {
          validationType: "isString",
        },
      ],
    },
    password: {
      label: fakeMessageDescriptor("password"),
      type: "password",
      validations: [
        {
          validationType: "isString",
        },
      ],
    },
    user: {
      label: fakeMessageDescriptor("user"),
      type: "text",
      validations: [
        {
          validationType: "isString",
        },
      ],
    },
    host: {
      label: fakeMessageDescriptor("host"),
      type: "text",
      validations: [
        {
          validationType: "isString",
        },
      ],
    },
    port: {
      label: fakeMessageDescriptor("port"),
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
      label: fakeMessageDescriptor("ssl"),
      type: "boolean",
      validations: [
        {
          validationType: "isBoolean",
        },
      ],
    },
    filename: {
      label: fakeMessageDescriptor("filename"),
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
      return await setupApiService.setUpDBCredentials(
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
