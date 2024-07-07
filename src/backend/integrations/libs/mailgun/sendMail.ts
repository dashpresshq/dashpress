import { msg } from "@lingui/macro";

import type { IAppliedSchemaFormConfig } from "@/shared/form-schemas/types";

import { makeIntegrationRequest } from "../makeIntegrationRequest";
import type { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  senderEmail: string;
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
    const form = new FormData();
    form.append("from", messageConfig.senderEmail);
    form.append("to", messageConfig.to);
    form.append("subject", messageConfig.subject);
    form.append("text", messageConfig.body);

    return await makeIntegrationRequest("POST", {
      url: `https://api.mailgun.net/v3/${config.domain}/messages`,
      body: form,
      headers: JSON.stringify({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`api:${config.apiKey}`)}`,
      }),
    });
  },
};
