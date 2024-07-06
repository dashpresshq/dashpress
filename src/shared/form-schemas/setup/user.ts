import { msg } from "@lingui/macro";

import type { IAppliedSchemaFormConfig } from "../types";

export type ISetupUserForm = {
  name: string;
  username: string;
  password: string;
};

export const SETUP_USER_FORM_SCHEMA: IAppliedSchemaFormConfig<ISetupUserForm> =
  {
    username: {
      label: msg`Username`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "alphanumeric",
        },
      ],
    },
    name: {
      label: msg`Name`,
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
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
