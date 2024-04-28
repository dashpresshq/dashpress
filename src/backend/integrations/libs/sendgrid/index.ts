import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { msg } from "@lingui/macro";
import { SEND_MAIL } from "./sendMail";
import { IActionConfig } from "./types";

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

export const SEND_GRID_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SendGrid",
  description: "Send emails through SendGrid",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MAIL,
  },
};
