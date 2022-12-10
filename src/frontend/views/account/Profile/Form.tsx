import { ButtonLang, IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
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
      buttonText={`${ButtonLang.update} Profile`}
      fields={UPDATE_PROFILE_FORM_SCHEMA}
    />
  );
}
