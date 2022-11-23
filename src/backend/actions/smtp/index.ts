import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";

interface ISMTPActionConfig {
  host: string;
  port: number;
  secure: true;
  authUser: string;
  authPassword: string;
  defaultSenderName: string;
  defaultSenderAddress: string;
}

export const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<ISMTPActionConfig> =
  {
    host: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    port: {
      type: "number",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    secure: {
      type: "boolean",
      validations: [],
    },
    authUser: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    authPassword: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    defaultSenderName: {
      type: "text",
      validations: [],
    },
    defaultSenderAddress: {
      type: "text",
      validations: [],
    },
  };

interface ISendMessageConfig {
  to: string;
  subject: string;
  body: string;
  overrideSenderName: string;
  overrideSenderAddress: string;
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
  overrideSenderName: {
    type: "text",
    validations: [],
  },
  overrideSenderAddress: {
    type: "text",
    validations: [],
  },
};

export const SMTP_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SMTP",
  description: "Send Message to the ones you love",
  configurationSchema: CONFIGURATION_SCHEMA,
  connect: async () => {
    // console.log("Connect to mail");
  },
  performsImplementation: {
    SEND_MESSAGE: {
      label: "Send Message",
      configurationSchema: SEND_MAIL_SCHEMA,
      do: async () => {},
    },
  },
};
