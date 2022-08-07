import { ISchemaFormConfig } from "..";

export type ISignInForm = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export const AUTH_SIGNIN_FORM_SCHEMA: Record<
  keyof ISignInForm,
  ISchemaFormConfig
> = {
  username: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  password: {
    type: "password",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  rememberMe: {
    type: "boolean",
    label: "Remember Me",
    validations: [],
  },
};
