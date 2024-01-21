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
    return await makeIntegrationRequest("POST", {
      url: `https://api.sendgrid.com/v3/mail/send`,
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              {
                email: messageConfig.to,
              },
            ],
            // cc: [
            //   {
            //     email: messageConfig.to,
            //   },
            // ],
            // bcc: [
            //   {
            //     email: messageConfig.to,
            //   },
            // ],
          },
        ],
        from: {
          email: messageConfig.senderEmail,
          name: messageConfig.senderName,
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
};
