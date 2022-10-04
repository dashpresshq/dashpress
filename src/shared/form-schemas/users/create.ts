import { IAppliedSchemaFormConfig } from "../types";

export type ICreateUserForm = {
  name: string;
  username: string;
  role: string;
  password: string;
};

export const CREATE_USER_FORM_SCHEMA: IAppliedSchemaFormConfig<ICreateUserForm> =
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
    role: {
      type: "selection",
      selectionUrl: "/api/roles",
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
