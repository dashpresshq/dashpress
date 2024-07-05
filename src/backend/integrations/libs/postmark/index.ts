import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import type { IActionIntegrationsImplemention } from "shared/types/actions";
import { msg } from "@lingui/macro";
import { SEND_MAIL } from "./sendMail";
import type { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  serverToken: {
    label: msg`Token`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const POST_MARK_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Postmark",
  description: "Send emails through Postmark",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_MAIL,
  },
};
