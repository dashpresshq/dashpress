import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { makeIntegrationRequest } from "../makeIntegrationRequest";
import { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  overrideSenderEmail?: string;
  overrideSenderName?: string;
}

const CONFIG_SCHEMA: IAppliedSchemaFormConfig<IConfig> = {
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
    type: "richtext",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  overrideSenderEmail: {
    type: "text",
    validations: [],
  },
  overrideSenderName: {
    type: "text",
    validations: [],
  },
};

export const SEND_MAIL = {
  label: "Send Mail",
  configurationSchema: CONFIG_SCHEMA,
  do: async (config: IActionConfig, messageConfig: IConfig) => {
    await makeIntegrationRequest("POST", {
      url: `https://api.sendinblue.com/v3/smtp/email`,
      body: JSON.stringify({
        sender: {
          name: messageConfig.overrideSenderName || config.defaultSenderName,
          email: messageConfig.overrideSenderEmail || config.defaultSenderEmail,
        },
        to: [
          {
            email: messageConfig.to,
          },
        ],
        subject: messageConfig.subject,
        htmlContent: messageConfig.body,
      }),
      headers: JSON.stringify({
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Postmark-Server-Token": `api-key:${config.apiKey}`,
      }),
    });
  },
};
