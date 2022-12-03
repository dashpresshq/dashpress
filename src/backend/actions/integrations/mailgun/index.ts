import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { makeIntegrationRequest } from "../makeIntegrationRequest";

type IActionConfig = {
  apiKey: string;
  domain: string;
};

export const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  apiKey: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  domain: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

interface ISendMessageConfig {
  to: string;
  subject: string;
  body: string;
  overrideSenderName: string;
  overrideSenderAddress: string;
}

const SEND_MAIL_SCHEMA: IAppliedSchemaFormConfig<ISendMessageConfig> = {
  to: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  subject: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  body: {
    type: "textarea",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  overrideSenderName: {
    type: "text",
    validations: [],
  },
  overrideSenderAddress: {
    type: "text",
    validations: [],
  },
};

export const MAIL_GUN_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Mail Gun",
  description: "Send emails through Mailgun",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MAIL_SCHEMA,
      do: async (config: IActionConfig, messageConfig: ISendMessageConfig) => {
        const form = new FormData();
        form.append("from", messageConfig.overrideSenderAddress);
        form.append("to", messageConfig.to);
        form.append("subject", messageConfig.subject);
        form.append("text", messageConfig.body);

        makeIntegrationRequest("POST", {
          url: `https://api.mailgun.net/v3/${config.domain}/messages`,
          body: form,
          headers: JSON.stringify({
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa("api:YOUR_API_KEY")}`,
          }),
        });
      },
    },
  },
};
