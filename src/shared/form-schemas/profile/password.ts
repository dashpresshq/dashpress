import { msg } from "@lingui/macro";
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
      label: msg`Old Password`,
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    newPassword: {
      type: "password",
      label: msg`New Password`,
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    reNewPassword: {
      type: "password",
      label: msg`New Password Again`,
      validations: [
        {
          validationType: "required",
        },
        {
          validationType: "matchOtherField",
          constraint: {
            otherField: `newPassword`,
          },
        },
      ],
    },
  };
