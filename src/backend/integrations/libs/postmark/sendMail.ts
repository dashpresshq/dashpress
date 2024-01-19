import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { makeIntegrationRequest } from "../makeIntegrationRequest";
import { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  senderEmail?: string;
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
};

export const SEND_MAIL = {
  label: "Send Mail",
  configurationSchema: CONFIG_SCHEMA,
  do: async (config: IActionConfig, messageConfig: IConfig) => {
    await makeIntegrationRequest("POST", {
      url: `https://api.postmarkapp.com/email`,
      body: JSON.stringify({
        From: messageConfig.senderEmail,
        To: messageConfig.to,
        subject: messageConfig.subject,
        HtmlBody: messageConfig.body,
        MessageStream: "outbound",
      }),
      headers: JSON.stringify({
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Postmark-Server-Token": `${config.serverToken}`,
      }),
    });
  },
};
