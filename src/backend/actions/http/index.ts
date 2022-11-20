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
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

const ACTION_CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IAction> = {
  ...BASE_CONFIGURATION_SCHEMA,
  body: {
    type: "json",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const HTTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "HTTP",
  description: "Performs HTTP request",
  configurationSchema: {},
  connect: async () => {},
  performsImplementation: {
    PUT: { label: "PUT", configurationSchema: {}, do: async () => {} },
    GET: {
      label: "GET",
      configurationSchema: BASE_CONFIGURATION_SCHEMA,
      do: async () => {},
    },
    POST: {
      label: "POST",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async () => {},
    },
    PATCH: {
      label: "PATCH",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async () => {},
    },
    DELETE: {
      label: "DELETE",
      configurationSchema: ACTION_CONFIGURATION_SCHEMA,
      do: async () => {},
    },
  },
};
