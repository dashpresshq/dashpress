import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { makeActionRequest } from "../makeActionRequest";

type ISlackActionConfig = {
  token: string;
};

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
  description: "Send Message to the ones you love",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: ISlackActionConfig) => {
    return config;
  },
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MESSAGE_SCHEMA,
      do: async (
        config: ISlackActionConfig,
        messageConfig: ISendMessageConfig
      ) => {
        makeActionRequest("POST", {
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
