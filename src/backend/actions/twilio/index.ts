import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";
import { makeActionRequest } from "../makeActionRequest";

type IActionConfig = {
  authToken: string;
  accountSid: string;
};

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

interface ISendMessageConfig {
  from: string;
  to: string;
  body: string;
}

const SEND_MESSAGE_SCHEMA: IAppliedSchemaFormConfig<ISendMessageConfig> = {
  from: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  to: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  body: {
    type: "textarea",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export const TWILIO_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "Twilio",
  description: "Send Message to the ones you love",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async (config: IActionConfig) => {
    return config;
  },
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MESSAGE_SCHEMA,
      do: async (config: IActionConfig, messageConfig: ISendMessageConfig) => {
        makeActionRequest("POST", {
          url: `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`,
          body: `From=${messageConfig.from}&Body=${messageConfig.body}&To=${messageConfig.from}`,
          headers: JSON.stringify({
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(
              `${config.accountSid}:${config.authToken}`
            )}`,
          }),
        });
      },
    },
  },
};
