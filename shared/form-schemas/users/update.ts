import { StringUtils } from "@gothicgeeks/shared";
import { AccountRole } from "shared/types";
import { IAppliedSchemaFormConfig } from "..";

export type IUpdateUserForm = {
  name: string;
  role: AccountRole;
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
      selections: Object.values(AccountRole).map((role) => ({
        value: role,
        label: StringUtils.upperCaseFirstLetter(role),
      })),
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "isIn",
          constraint: {
            options: Object.values(AccountRole),
          },
        },
      ],
    },
    systemProfile: {
      type: "textarea",
      //    :eyes to move to form code editor
      validations: [],
    },
  };
