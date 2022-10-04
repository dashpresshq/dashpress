import { IAppliedSchemaFormConfig } from "../../types";

export type IBasePermissionForm = {
  permission: string;
};

export const BASE_PERMISSION_FORM_SCHEMA: IAppliedSchemaFormConfig<IBasePermissionForm> =
  {
    permission: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  };
