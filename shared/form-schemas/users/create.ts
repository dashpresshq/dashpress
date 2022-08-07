import { StringUtils } from "@gothicgeeks/shared";
import { AccountRole } from "shared/types";
import { ISchemaFormConfig } from "..";

export type ICreateUserForm = {
  name: string;
  username: string;
  role: AccountRole;
  password: string;
};

export const CREATE_USER_FORM_SCHEMA: Record<
  keyof ICreateUserForm,
  ISchemaFormConfig
> = {
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
    selections: Object.values(AccountRole).map((role) => ({
      value: role,
      label: StringUtils.upperCaseFirstLetter(role),
    })),
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
