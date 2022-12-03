import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { SEND_SMS } from "./sendSms";
import { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  authToken: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  accountSid: {
    type: "text",
    label: "Account SID",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const TWILIO_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Twilio",
  description: "Send SMS through Twilio",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => config,
  performsImplementation: {
    SEND_SMS,
  },
};
