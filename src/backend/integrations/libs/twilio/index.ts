import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { msg } from "@lingui/macro";
import { i18nNoop } from "translations/fake";
import { SEND_SMS } from "./sendSms";
import { IActionConfig } from "./types";

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<IActionConfig> = {
  authToken: {
    label: msg`Token`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  accountSid: {
    label: i18nNoop("Account SID"),
    type: "text",
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
