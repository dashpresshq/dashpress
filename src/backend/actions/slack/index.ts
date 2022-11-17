import { IActionIntegrationsImplemention } from "../types";

export const SLACK_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Slack",
  description: "Send Message to the ones you love",
  configurationSchema: {},
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: {},
      do: async () => {},
    },
  },
};
