import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { SEND_MAIL } from "./sendMail";
import { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  serverToken: {
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
