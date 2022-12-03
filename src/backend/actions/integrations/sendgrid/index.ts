import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { makeIntegrationRequest } from "../makeIntegrationRequest";

type IActionConfig = {
  apiKey: string;
  defaultSenderName: string;
  defaultSenderAddress: string;
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
  defaultSenderName: {
    type: "text",
    validations: [],
  },
  defaultSenderAddress: {
    type: "text",
    validations: [],
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

export const SEND_GRID_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SendGrid",
  description: "Send emails through SendGrid",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MAIL_SCHEMA,
      do: async (config: IActionConfig, messageConfig: ISendMessageConfig) => {
        makeIntegrationRequest("POST", {
          url: `https://api.sendgrid.com/v3/mail/send`,
          body: JSON.stringify({
            personalizations: [
              {
                to: [
                  {
                    email: messageConfig.to,
                  },
                ],
                cc: [
                  {
                    email: messageConfig.to,
                  },
                ],
                bcc: [
                  {
                    email: messageConfig.to,
                  },
                ],
              },
            ],
            from: {
              email:
                messageConfig.overrideSenderAddress ||
                config.defaultSenderAddress,
              name:
                messageConfig.overrideSenderName || config.defaultSenderName,
            },
            subject: messageConfig.subject,
            content: [
              {
                type: "text/html",
                value: messageConfig.body,
              },
            ],
          }),
          headers: JSON.stringify({
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          }),
        });
      },
    },
  },
};
