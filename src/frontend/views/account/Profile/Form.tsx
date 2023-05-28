import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import {
  IUpdateUserForm,
  UPDATE_PROFILE_FORM_SCHEMA,
} from "shared/form-schemas/profile/update";
import { ACCOUNT_PROFILE_CRUD_CONFIG } from "../constants";

export function UpdateProfileForm({
  onSubmit,
  initialValues,
}: IFormProps<IUpdateUserForm>) {
  return (
    <SchemaForm<IUpdateUserForm>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={ACCOUNT_PROFILE_CRUD_CONFIG.FORM_LANG.UPSERT}
      fields={UPDATE_PROFILE_FORM_SCHEMA}
      icon="save"
    />
  );
}
