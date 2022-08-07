import { ISchemaFormConfig } from "..";

export type IUpdateUserForm = {
  name: string;
};

export const UPDATE_PROFILE_FORM_SCHEMA: Record<
  keyof IUpdateUserForm,
  ISchemaFormConfig
> = {
  name: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};
