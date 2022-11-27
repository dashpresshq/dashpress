import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";

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

const makeActionRequest = async (
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  configuration: IAction
) => {
  const response = await fetch(configuration.url, {
    method,
    headers: JSON.parse(configuration.headers),
    body: configuration.body ? JSON.stringify(configuration.body) : undefined,
  });
  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      return response;
    }
  }
  const error = await response.json();
  throw new Error(error.message);
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
        const response = await fetch(configuration.url, {
          method: "GET",
          headers: JSON.parse(configuration.headers),
        });
        if (response.ok) {
          return await response.json();
        }
        const error = await response.json();
        throw new Error(error.message);
      },
    },
    PUT: {
      label: "PUT",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeActionRequest("POST", configuration);
      },
    },
    POST: {
      label: "POST",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeActionRequest("POST", configuration);
      },
    },
    PATCH: {
      label: "PATCH",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeActionRequest("PATCH", configuration);
      },
    },
    DELETE: {
      label: "DELETE",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async (_, configuration: IAction) => {
        await makeActionRequest("DELETE", configuration);
      },
    },
  },
};
