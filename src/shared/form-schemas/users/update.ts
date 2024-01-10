import { IAppliedSchemaFormConfig } from "../types";

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
      apiSelections: {
        listUrl: "/api/roles",
      },
      validations: [
        {
          validationType: "required",
        },
      ],
      formState: ($) => ({
        disabled: $.auth.username === $.routeParams.username,
      }),
    },
    systemProfile: {
      type: "json",
      validations: [
        {
          validationType: "isJson",
        },
      ],
    },
  };
