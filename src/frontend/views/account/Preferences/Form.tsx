import { IFormProps } from "frontend/lib/form/types";
import { SchemaForm } from "frontend/components/SchemaForm";
import { UPDATE_USER_PREFERENCES_FORM_SCHEMA } from "shared/form-schemas/profile/update";
import { IUserPreferences } from "shared/types/user";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import uniqBy from "lodash/uniqBy";
import { useEffect } from "react";
import { usePortalThemes } from "frontend/_layouts/portal";
import { ACCOUNT_PREFERENCES_CRUD_CONFIG } from "../constants";

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
