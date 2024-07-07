import { msg } from "@lingui/macro";

import type { IAppliedSchemaFormConfig } from "@/shared/form-schemas/types";
import type { IActionIntegrationsImplemention } from "@/shared/types/actions";

import { SEND_MAIL } from "./sendMail";
import type { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  apiKey: {
    label: msg`API Key`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const SENDINBLUE_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SendInBlue",
  description: "Send emails through SendInBlue",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MAIL,
  },
};
