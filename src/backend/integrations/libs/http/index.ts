import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { msg } from "@lingui/macro";
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
    label: msg`URL`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  headers: {
    label: msg`Headers`,
    type: "json",
    validations: [],
  },
};

const ACTION_CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IAction> = {
  ...BASE_CONFIGURATION_SCHEMA,
  body: {
    label: msg`Body`,
    type: "json",
    validations: [],
  },
};

export const HTTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "HTTP",
  description: "Performs HTTP request",
  configurationSchema: {},
  connect: async () => {},
  performsImplementation: {
    GET: {
      label: "GET",
      configurationSchema: BASE_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IBase) => {
        return await makeIntegrationRequest("GET", configuration);
      },
    },
    PUT: {
      label: "PUT",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        return await makeIntegrationRequest("PUT", configuration);
      },
    },
    POST: {
      label: "POST",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        return await makeIntegrationRequest("POST", configuration);
      },
    },
    PATCH: {
      label: "PATCH",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        return await makeIntegrationRequest("PATCH", configuration);
      },
    },
    DELETE: {
      label: "DELETE",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        return await makeIntegrationRequest("DELETE", configuration);
      },
    },
  },
};
