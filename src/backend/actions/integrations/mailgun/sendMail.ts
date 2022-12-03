import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { makeIntegrationRequest } from "../makeIntegrationRequest";
import { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  overrideSenderName?: string;
  overrideSenderEmail?: string;
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
  overrideSenderName: {
    type: "text",
    validations: [],
  },
  overrideSenderEmail: {
    type: "text",
    validations: [],
  },
};

export const SEND_MAIL = {
  label: "Send Mail",
  configurationSchema: CONFIG_SCHEMA,
  do: async (config: IActionConfig, messageConfig: IConfig) => {
    const form = new FormData();
    form.append(
      "from",
      messageConfig.overrideSenderEmail || config.defaultSenderEmail
    );
    form.append("to", messageConfig.to);
    form.append("subject", messageConfig.subject);
    form.append("text", messageConfig.body);

    await makeIntegrationRequest("POST", {
      url: `https://api.mailgun.net/v3/${config.domain}/messages`,
      body: form,
      headers: JSON.stringify({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`api:${config.apiKey}`)}`,
      }),
    });
  },
};
