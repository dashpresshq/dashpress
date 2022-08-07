import { ButtonLang, StringUtils } from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";
import { AccountRole } from "shared/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";

type ICreateUserForm = {
  name: string;
  username: string;
  role: AccountRole;
  password: string;
};

export function CreateUserForm({ onSubmit }: IFormProps<ICreateUserForm>) {
  return (
    <SchemaForm<ICreateUserForm>
      onSubmit={onSubmit}
      buttonText={ButtonLang.create}
      fields={{
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
      }}
    />
  );
}
