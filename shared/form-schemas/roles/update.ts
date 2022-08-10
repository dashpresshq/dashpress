import { IAppliedSchemaFormConfig } from "..";

export type IUpdateRoleForm = {
  name: string;
};

export const UPDATE_ROLE_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateRoleForm> =
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
