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
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import languages from "translations/languages";
import { msg } from "@lingui/macro";
import { useRouter } from "next/router";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { typescriptSafeObjectDotKeys } from "shared/lib/objects";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { ACCOUNT_VIEW_KEY } from "../constants";
import { BaseAccountLayout } from "../_Base";
import { UPDATE_USER_PREFERENCES_FORM_SCHEMA } from "./constants";
import { IUserPreferences } from "./types";
import { PortalUserPreferences } from "./portal";

export const LANGUAGE_PREFERENCES_FORM_SCHEMA: IAppliedSchemaFormConfig<{
  locale: string;
}> = {
  locale: {
    label: msg`Language`,
    type: "selection",
    validations: [
      {
        validationType: "required",
      },
    ],
    selections: languages.map((language) => ({
      label: msg`${language.msg}`,
      value: language.locale,
    })),
  },
};

export function UserPreferences() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PREFERENCES);
  const userPreferences = useUserPreference("theme");
  const upsertUserPreferenceMutation = useUpsertUserPreferenceMutation("theme");
  const router = useRouter();

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const portalThemes = usePortalThemes();

  useEffect(() => {
    UPDATE_USER_PREFERENCES_FORM_SCHEMA.theme.selections = uniqBy(
      [
        ...UPDATE_USER_PREFERENCES_FORM_SCHEMA.theme.selections,
        ...typescriptSafeObjectDotKeys(portalThemes).map((theme) => ({
          value: theme,
          label: msg`${userFriendlyCase(theme)}`,
        })),
      ],
      "value"
    );
  }, []);

  return (
    <BaseAccountLayout>
      <SectionBox title={domainMessages.TEXT_LANG.TITLE}>
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
            buttonText={domainMessages.FORM_LANG.UPSERT}
            fields={UPDATE_USER_PREFERENCES_FORM_SCHEMA}
            systemIcon="Save"
          />
        </ViewStateMachine>
      </SectionBox>

      <Spacer />

      <SectionBox title={msg`Language`}>
        <SchemaForm<{ locale: string }>
          onSubmit={async (data) => {
            const { pathname, asPath, query } = router;

            router.push({ pathname, query }, asPath, { locale: data.locale });

            /*
    const date = new Date()
         const expireMs = 100 * 24 * 60 * 60 * 1000 // 100 days
         date.setTime(date.getTime() + expireMs)
         document.cookie = `NEXT_LOCALE=${locale};expires=${date.toUTCString()};path=/`
            */
            // TODO set cookie to NEXT_LOCALE=the-locale
          }}
          initialValues={{ locale: router.locale || router.defaultLocale }}
          buttonText={() => msg`Change Language`}
          fields={LANGUAGE_PREFERENCES_FORM_SCHEMA}
          systemIcon="Save"
        />
      </SectionBox>

      <PortalUserPreferences />
    </BaseAccountLayout>
  );
}
