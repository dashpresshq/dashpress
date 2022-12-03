import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { makeIntegrationRequest } from "../makeIntegrationRequest";

type IActionConfig = {
  token: string;
};

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
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
    type: "textarea",
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
  description: "Send messages to your Slack channels",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MESSAGE_SCHEMA,
      do: async (config: IActionConfig, messageConfig: ISendMessageConfig) => {
        makeIntegrationRequest("POST", {
          url: "https://slack.com/api/chat.postMessage",
          body: JSON.stringify({
            channel: messageConfig.channel,
            text: messageConfig.message,
          }),
          headers: JSON.stringify({
            "Content-Type": "application/json",
            Authorization: `Bearer  ${config.token}`,
          }),
        });
      },
    },
  },
};
