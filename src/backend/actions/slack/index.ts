import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "../types";

interface ISlackActionConfig {
  token: string;
}

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<ISlackActionConfig> = {
  token: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

interface ISendMessageConfig {
  message: string;
  channel: string;
}

const SEND_MESSAGE_SCHEMA: IAppliedSchemaFormConfig<ISendMessageConfig> = {
  message: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  channel: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const SLACK_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Slack",
  description: "Send Message to the ones you love",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async () => {
    console.log("Connect to slack");
  },
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MESSAGE_SCHEMA,
      do: async () => {},
    },
  },
};
