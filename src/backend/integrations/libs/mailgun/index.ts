import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import type { IActionIntegrationsImplemention } from "shared/types/actions";
import { msg } from "@lingui/macro";
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
  domain: {
    label: msg`Domain`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const MAIL_GUN_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Mail Gun",
  description: "Send emails through Mailgun",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MAIL,
  },
};
