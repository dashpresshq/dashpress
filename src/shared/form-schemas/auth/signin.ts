import { msg } from "@lingui/macro";

import type { IAppliedSchemaFormConfig } from "../types";

export type ISignInForm = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export const AUTH_SIGNIN_FORM_SCHEMA: IAppliedSchemaFormConfig<ISignInForm> = {
  username: {
    type: "text",
    label: msg`Username`,
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  password: {
    type: "password",
    label: msg`Password`,
    validations: [
      {
        validationType: "required",
      },
    ],
  },
  rememberMe: {
    type: "boolean",
    label: msg`Remember Me`,
    validations: [],
  },
};
