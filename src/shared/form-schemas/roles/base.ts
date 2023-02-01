import { IAppliedSchemaFormConfig } from "../types";

export type IBaseRoleForm = {
  name: string;
};

export const BASE_ROLE_FORM_SCHEMA: IAppliedSchemaFormConfig<IBaseRoleForm> = {
  name: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};
