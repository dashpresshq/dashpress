import { msg } from "@lingui/macro";

import type { IAppliedSchemaFormConfig } from "@/shared/form-schemas/types";
import type { IActionIntegrationsImplemention } from "@/shared/types/actions";

import { SEND_MESSAGE } from "./sendMessage";
import type { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  token: {
    label: msg`Token`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const SLACK_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Slack",
  description: "Send messages to your Slack channels",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MESSAGE,
  },
};
