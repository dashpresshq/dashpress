import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionIntegrationsImplemention } from "shared/types/actions";

interface ISendGridActionConfig {
  apiKey: string;
}

export const CONFIGURATION_SCHEMA: IAppliedSchemaFormConfig<ISendGridActionConfig> =
  {
    apiKey: {
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

export const SEND_GRID_ACTION_INTEGRATION: IActionIntegrationsImplemention = {
  title: "SendGrid",
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
