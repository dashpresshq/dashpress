import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import nodemailer from "nodemailer";
import { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  overrideSenderName: string;
  overrideSenderAddress: string;
}

const CONFIG_SCHEMA: IAppliedSchemaFormConfig<IConfig> = {
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

export const SEND_MAIL = {
  label: "Send Mail",
  configurationSchema: CONFIG_SCHEMA,
  do: async (
    instance: [nodemailer.Transporter, IActionConfig],
    config: IConfig
  ) => {
    await instance[0].sendMail({
      from: config.overrideSenderAddress
        ? `${config.overrideSenderName} <${config.overrideSenderAddress}>`
        : `${instance[1].defaultSenderName} <${instance[1].defaultSenderAddress}>`,
      to: config.to, // "bar@example.com, baz@example.com",
      subject: config.subject,
      html: config.body,
    });
  },
};
