import { IActionIntegrationsImplemention } from "shared/types/actions";

export const HTTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "HTTP",
  description: "Performs XXX",
  configurationSchema: {},
  connect: async () => {},
  performsImplementation: {
    PUT: { label: "PUT", configurationSchema: {}, do: async () => {} },
    GET: { label: "GET", configurationSchema: {}, do: async () => {} },
    POST: { label: "POST", configurationSchema: {}, do: async () => {} },
    PATCH: { label: "PATCH", configurationSchema: {}, do: async () => {} },
    DELETE: { label: "DELETE", configurationSchema: {}, do: async () => {} },
  },
};
