import { IUserPreferences } from "shared/types/user";
import { IAppliedSchemaFormConfig } from "../types";

export type IUpdateUserForm = {
  name: string;
};

export const UPDATE_PROFILE_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateUserForm> =
  {
    name: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  };

export const UPDATE_USER_PREFERENCES_FORM_SCHEMA: IAppliedSchemaFormConfig<IUserPreferences> =
  {
    theme: {
      type: "text",
      validations: [],
    },
  };
