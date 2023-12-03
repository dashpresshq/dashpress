import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { useEffect } from "react";
import { usePortalThemes } from "frontend/_layouts/portal";
import { uniqBy } from "shared/lib/array/uniq-by";
import {
  ACCOUNT_PREFERENCES_CRUD_CONFIG,
  UPDATE_USER_PREFERENCES_FORM_SCHEMA,
} from "./constants";
import { IUserPreferences } from "./types";

export function UserPreferencesForm({
  onSubmit,
  initialValues,
}: IFormProps<IUserPreferences>) {
  const portalThemes = usePortalThemes();

  useEffect(() => {
    UPDATE_USER_PREFERENCES_FORM_SCHEMA.theme.selections = uniqBy(
      [
        ...UPDATE_USER_PREFERENCES_FORM_SCHEMA.theme.selections,
        ...Object.keys(portalThemes).map((theme) => ({
          value: theme,
          label: userFriendlyCase(theme),
        })),
      ],
      "value"
    );
  }, []);
  return (
    <SchemaForm<IUserPreferences>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText={ACCOUNT_PREFERENCES_CRUD_CONFIG.FORM_LANG.UPSERT}
      fields={UPDATE_USER_PREFERENCES_FORM_SCHEMA}
      icon="save"
    />
  );
}
