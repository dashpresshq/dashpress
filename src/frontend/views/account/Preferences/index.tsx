import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import {
  useUpsertUserPreferenceMutation,
  useUserPreference,
} from "frontend/hooks/auth/preferences.store";
import { SchemaForm } from "frontend/components/SchemaForm";
import { usePortalThemes } from "frontend/_layouts/portal";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { uniqBy } from "shared/lib/array/uniq-by";
import { useEffect } from "react";
import { ACCOUNT_VIEW_KEY } from "../constants";

import { BaseAccountLayout } from "../_Base";
import {
  ACCOUNT_PREFERENCES_CRUD_CONFIG,
  UPDATE_USER_PREFERENCES_FORM_SCHEMA,
} from "./constants";
import { IUserPreferences } from "./types";
import { PortalUserPreferences } from "./portal";

export function UserPreferences() {
  const userPreferences = useUserPreference("theme");
  const upsertUserPreferenceMutation = useUpsertUserPreferenceMutation("theme");

  useSetPageDetails({
    pageTitle: ACCOUNT_PREFERENCES_CRUD_CONFIG.TEXT_LANG.EDIT,
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

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
    <BaseAccountLayout>
      <SectionBox title={ACCOUNT_PREFERENCES_CRUD_CONFIG.TEXT_LANG.EDIT}>
        <ViewStateMachine
          loading={userPreferences.isLoading}
          error={userPreferences.error}
          loader={<FormSkeleton schema={[FormSkeletonSchema.Input]} />}
        >
          <SchemaForm<IUserPreferences>
            onSubmit={async (data) => {
              await upsertUserPreferenceMutation.mutateAsync(data.theme);
            }}
            initialValues={{ theme: userPreferences.data }}
            buttonText={ACCOUNT_PREFERENCES_CRUD_CONFIG.FORM_LANG.UPSERT}
            fields={UPDATE_USER_PREFERENCES_FORM_SCHEMA}
            icon="save"
          />
        </ViewStateMachine>
      </SectionBox>
      <PortalUserPreferences />
    </BaseAccountLayout>
  );
}
