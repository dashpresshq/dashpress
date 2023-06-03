import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { makeIntegrationRequest } from "../makeIntegrationRequest";

interface IBase {
  url: string;
  headers: string;
}

interface IAction extends IBase {
  body: string;
}

const BASE_CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IBase> = {
  url: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  headers: {
    type: "json",
    validations: [],
  },
};

const ACTION_CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IAction> = {
  ...BASE_CONFIGURATION_SCHEMA,
  body: {
    type: "json",
    validations: [],
  },
};

export const HTTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "HTTP",
  credentialsKey: "HTTP",
  description: "Performs HTTP request",
  configurationSchema: {},
  connect: async () => {},
  performsImplementation: {
    GET: {
      label: "GET",
      configurationSchema: BASE_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IBase) => {
        await makeIntegrationRequest("GET", configuration);
      },
    },
    PUT: {
      label: "PUT",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeIntegrationRequest("PUT", configuration);
      },
    },
    POST: {
      label: "POST",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeIntegrationRequest("POST", configuration);
      },
    },
    PATCH: {
      label: "PATCH",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeIntegrationRequest("PATCH", configuration);
      },
    },
    DELETE: {
      label: "DELETE",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeIntegrationRequest("DELETE", configuration);
      },
    },
  },
};
