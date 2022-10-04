import { IAppliedSchemaFormConfig } from "../types";

export type ICreateRoleForm = {
  name: string;
};

export const CREATE_ROLE_FORM_SCHEMA: IAppliedSchemaFormConfig<ICreateRoleForm> =
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
