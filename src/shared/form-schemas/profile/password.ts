import { t } from "@lingui/macro";
import { IAppliedSchemaFormConfig } from "../types";

export type IChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
};

export const CHANGE_PASSWORD_FORM_SCHEMA: IAppliedSchemaFormConfig<IChangePasswordForm> =
  {
    oldPassword: {
      type: "password",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    newPassword: {
      type: "password",
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    reNewPassword: {
      type: "password",
      label: t`New Password Again`,
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "matchOtherField",
          constraint: {
            otherField: t`newPassword`,
          },
        },
      ],
    },
  };
