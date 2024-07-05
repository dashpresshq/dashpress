import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
import { makeIntegrationRequest } from "../makeIntegrationRequest";
import type { IActionConfig } from "./types";

interface IConfig {
  from: string;
  to: string;
  body: string;
}

const CONFIG_SCHEMA: IAppliedSchemaFormConfig<IConfig> = {
  from: {
    label: msg`From`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  to: {
    label: msg`To`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  body: {
    label: msg`Body`,
    type: "textarea",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const SEND_SMS = {
  label: msg`Send SMS`,
  configurationSchema: CONFIG_SCHEMA,
  do: async (config: IActionConfig, messageConfig: IConfig) => {
    return await makeIntegrationRequest("POST", {
      url: `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
      body: new URLSearchParams({
        Body: messageConfig.body,
        From: messageConfig.from,
        To: messageConfig.to,
      }).toString(),
      headers: JSON.stringify({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${config.accountSid}:${config.authToken}`
        )}`,
      }),
    });
  },
};
