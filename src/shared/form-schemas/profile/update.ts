import { msg } from "@lingui/macro";

import type { IAppliedSchemaFormConfig } from "../types";

export type IUpdateProfileForm = {
  name: string;
};

export const UPDATE_PROFILE_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateProfileForm> =
  {
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
