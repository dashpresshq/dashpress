import { ISchemaFormConfig } from "..";

export type IChangePasswordForm = {
  name: string;
};

export const CHANGE_PASSWORD_FORM_SCHEMA: Record<
  keyof IChangePasswordForm,
  ISchemaFormConfig
> = {
  name: {
    type: "password",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};
