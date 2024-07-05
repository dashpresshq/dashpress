import { msg } from "@lingui/macro";
import type { IAppliedSchemaFormConfig } from "../types";

export type IResetPasswordForm = {
  password: string;
};

export const RESET_PASSWORD_FORM_SCHEMA: IAppliedSchemaFormConfig<IResetPasswordForm> =
  {
    password: {
      label: msg`Password`,
      type: "password",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  };
