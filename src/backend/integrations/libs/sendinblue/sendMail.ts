import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { makeIntegrationRequest } from "../makeIntegrationRequest";
import { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  senderEmail: string;
  senderName?: string;
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
  senderEmail: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  senderName: {
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
          name: messageConfig.senderName,
          email: messageConfig.senderEmail,
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
