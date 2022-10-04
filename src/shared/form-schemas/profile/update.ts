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
