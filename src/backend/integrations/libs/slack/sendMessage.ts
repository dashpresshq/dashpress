import { msg } from "@lingui/macro";
import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";

import { makeIntegrationRequest } from "../makeIntegrationRequest";
import type { IActionConfig } from "./types";

interface IConfig {
  message: string;
  channel: string;
}

const CONFIG_SCHEMA: IAppliedSchemaFormConfig<IConfig> = {
  channel: {
    label: msg`Channel`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  message: {
    label: msg`Message`,
    type: "richtext",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const SEND_MESSAGE = {
  label: msg`Send Message`,
  configurationSchema: CONFIG_SCHEMA,
  do: async (config: IActionConfig, messageConfig: IConfig) => {
    return await makeIntegrationRequest("POST", {
      url: "https://slack.com/api/chat.postMessage",
      body: JSON.stringify({
        channel: messageConfig.channel,
        text: messageConfig.message,
      }),
      headers: JSON.stringify({
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.token}`,
      }),
    });
  },
};
