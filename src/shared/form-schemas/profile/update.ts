import { IAppliedSchemaFormConfig } from "../types";

export type IUpdateProfileForm = {
  name: string;
};

export const UPDATE_PROFILE_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateProfileForm> =
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
