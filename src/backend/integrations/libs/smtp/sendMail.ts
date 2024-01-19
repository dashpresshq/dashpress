import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { Transporter } from "nodemailer";
import { IActionConfig } from "./types";

interface IConfig {
  to: string;
  subject: string;
  body: string;
  senderEmail: string;
  senderName?: string;
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
  senderEmail: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  senderName: {
    type: "text",
    validations: [],
  },
};

export const SEND_MAIL = {
  label: "Send Mail",
  configurationSchema: CONFIG_SCHEMA,
  do: async (
    instance: [Partial<Transporter>, IActionConfig],
    config: IConfig
  ) => {
    await instance[0].sendMail({
      from: `${config.senderName} <${config.senderEmail}>`,
      to: config.to, // "bar@example.com, baz@example.com",
      subject: config.subject,
      html: config.body,
    });
  },
};
