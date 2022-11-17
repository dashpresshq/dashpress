import { IActionIntegrationsImplemention } from "../types";

export const HTTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "HTTP",
  description: "Performs XXX",
  configurationSchema: {},
  performsImplementation: {
    PUT: { label: "PUT", configurationSchema: {}, do: async () => {} },
    GET: { label: "GET", configurationSchema: {}, do: async () => {} },
    POST: { label: "POST", configurationSchema: {}, do: async () => {} },
  },
};
