import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
import { IUserPreferences } from "./types";

export const UPDATE_USER_PREFERENCES_FORM_SCHEMA: IAppliedSchemaFormConfig<IUserPreferences> =
  {
    theme: {
      label: msg`Theme`,
      type: "selection",
      validations: [
        {
          validationType: "required",
        },
      ],
      selections: [
        {
          label: msg`Light`,
          value: "light",
        },
        {
          label: msg`Dark`,
          value: "dark",
        },
      ],
    },
  };
