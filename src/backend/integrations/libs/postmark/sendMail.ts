import { msg } from "@lingui/macro";
import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

import { makeIntegrationRequest } from "../makeIntegrationRequest";
import type { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  senderEmail?: string;
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
};

export const SEND_MAIL = {
  label: msg`Send Mail`,
  configurationSchema: CONFIG_SCHEMA,
  do: async (config: IActionConfig, messageConfig: IConfig) => {
    return await makeIntegrationRequest("POST", {
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
