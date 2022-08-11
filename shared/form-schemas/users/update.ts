import { IAppliedSchemaFormConfig } from "..";

export type IUpdateUserForm = {
  name: string;
  role: string;
  systemProfile: string;
};

export const UPDATE_USER_FORM_SCHEMA: IAppliedSchemaFormConfig<IUpdateUserForm> =
  {
    name: {
      type: "text",

      validations: [
        {
          validationType: "required",
        },
      ],
    },
    role: {
      type: "selection",
      selections: "/api/roles",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    systemProfile: {
      type: "textarea",
      //    :eyes to move to form code editor
      validations: [],
    },
  };
