import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
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
    label: msg`To`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  subject: {
    label: msg`Subject`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  body: {
    label: msg`Body`,
    type: "richtext",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  senderEmail: {
    label: msg`Sender Email`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  senderName: {
    label: msg`Sender Name`,
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
