import { IAppliedSchemaFormConfig } from "..";

export type ISetupUserForm = {
  name: string;
  username: string;
  password: string;
};

export const SETUP_USER_FORM_SCHEMA: IAppliedSchemaFormConfig<ISetupUserForm> =
  {
    username: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "alphanumeric",
        },
      ],
    },
    name: {
      type: "text",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    password: {
      type: "password",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
  };
