import { MAKE_CRUD_CONFIG } from "frontend/lib/crud-config";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
import { IUserPreferences } from "./types";

export const ACCOUNT_PREFERENCES_CRUD_CONFIG = MAKE_CRUD_CONFIG({
  plural: msg`Account Preferences`,
  singular: msg`Account Preferences`,
});

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
