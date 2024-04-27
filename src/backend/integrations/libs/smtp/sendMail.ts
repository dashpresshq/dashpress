import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { Transporter } from "nodemailer";
import { msg } from "@lingui/macro";
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
    label: msg`To`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  subject: {
    label: msg`Subject`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  body: {
    label: msg`Body`,
    type: "richtext",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  senderEmail: {
    label: msg`Sender Email`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  senderName: {
    label: msg`Sender Name`,
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
    return await instance[0].sendMail({
      from: `${config.senderName} <${config.senderEmail}>`,
      to: config.to, // "bar@example.com, baz@example.com",
      subject: config.subject,
      html: config.body,
    });
  },
};
