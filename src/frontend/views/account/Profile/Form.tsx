import { ButtonLang } from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import {
  IUpdateUserForm,
  UPDATE_PROFILE_FORM_SCHEMA,
} from "shared/form-schemas/profile/update";

export function UpdateProfileForm({
  onSubmit,
  initialValues,
}: IFormProps<IUpdateUserForm>) {
  return (
    <SchemaForm<IUpdateUserForm>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={ButtonLang.update}
      fields={UPDATE_PROFILE_FORM_SCHEMA}
    />
  );
}
