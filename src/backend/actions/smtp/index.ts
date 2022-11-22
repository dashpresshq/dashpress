import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";

interface ISMTPActionConfig {
  host: string;
  port: 465;
  secure: true;
  authUser: string;
  authPassword: string;
  defaultSenderName: string;
  defaultSenderAddress: string;
}

const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<ISMTPActionConfig> = {
  token: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

interface ISendMessageConfig {
  to: string;
  cc: string;
  subject: string;
  body: string;
}

const SEND_MAIL_SCHEMA: IAppliedSchemaFormConfig<ISendMessageConfig> = {
  to: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  cc: {
    type: "text",
    validations: [],
  },
  subject: {
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

export const SMTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SMTP",
  description: "Send Message to the ones you love",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async () => {
    // console.log("Connect to slack");
  },
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MAIL_SCHEMA,
      do: async () => {},
    },
  },
};
