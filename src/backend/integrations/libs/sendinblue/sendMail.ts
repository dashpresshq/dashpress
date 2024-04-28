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
  label: msg`Send Mail`,
  configurationSchema: CONFIG_SCHEMA,
  do: async (config: IActionConfig, messageConfig: IConfig) => {
    return await makeIntegrationRequest("POST", {
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
