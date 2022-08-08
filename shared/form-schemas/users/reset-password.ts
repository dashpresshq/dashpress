import { IAppliedSchemaFormConfig } from "..";

export type IResetPasswordForm = {
  password: string;
};

export const RESET_PASSWORD_FORM_SCHEMA: IAppliedSchemaFormConfig<IResetPasswordForm> =
  {
    password: {
      type: "password",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  };
