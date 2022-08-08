import { ButtonLang } from "@gothicgeeks/shared";
import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import {
  UPDATE_USER_FORM_SCHEMA,
  IUpdateUserForm,
} from "shared/form-schemas/users/update";

export function UpdateUserForm({
  onSubmit,
  initialValues,
  isMe,
}: IFormProps<IUpdateUserForm> & { isMe: boolean }) {
  return (
    <SchemaForm
      buttonText={ButtonLang.update}
      onSubmit={onSubmit}
      initialValues={initialValues}
      fields={UPDATE_USER_FORM_SCHEMA}
      fieldState={{
        role: {
          disabled: isMe,
        },
      }}
    />
  );
}
