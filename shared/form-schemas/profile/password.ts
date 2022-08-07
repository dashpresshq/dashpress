import { ISchemaFormConfig } from "..";

export type IChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
};

export const CHANGE_PASSWORD_FORM_SCHEMA: Record<
  keyof IChangePasswordForm,
  ISchemaFormConfig
> = {
  oldPassword: {
    type: "password",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  newPassword: {
    type: "password",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  reNewPassword: {
    type: "password",
    label: "New Password Again",
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "matchOtherField",
        constraint: {
          otherField: "newPassword",
        },
      },
    ],
  },
};
