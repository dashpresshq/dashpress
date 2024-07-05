import { msg } from "@lingui/macro";

import type { IAppliedSchemaFormConfig } from "../types";

export type IBaseRoleForm = {
  name: string;
};

export const BASE_ROLE_FORM_SCHEMA: IAppliedSchemaFormConfig<IBaseRoleForm> = {
  name: {
    label: msg`Name`,
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};
