import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import nodemailer from "nodemailer";
import { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  overrideSenderName: string;
  overrideSenderEmail: string;
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
    type: "richtext",
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
  overrideSenderEmail: {
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
      from: config.overrideSenderEmail
        ? `${config.overrideSenderName} <${config.overrideSenderEmail}>`
        : `${instance[1].defaultSenderName} <${instance[1].defaultSenderEmail}>`,
      to: config.to, // "bar@example.com, baz@example.com",
      subject: config.subject,
      html: config.body,
    });
  },
};
