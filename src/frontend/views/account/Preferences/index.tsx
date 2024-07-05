import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import type { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import languages from "translations/languages";
import { msg } from "@lingui/macro";
import { useRouter } from "next/router";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useTheme } from "next-themes";
import { SchemaForm } from "@/components/app/form/schema";
import { SectionBox } from "@/components/app/section-box";
import { ACCOUNT_VIEW_KEY } from "../constants";
import { BaseAccountLayout } from "../_Base";
import { PortalUserPreferences } from "./portal";

export type IUserPreferences = {
  theme: string;
};

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
  const { theme, setTheme, themes } = useTheme();
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.PREFERENCES);
  const router = useRouter();

  const UPDATE_USER_PREFERENCES_FORM_SCHEMA: IAppliedSchemaFormConfig<IUserPreferences> =
    {
      theme: {
        label: msg`Theme`,
        type: "selection",
        validations: [
          {
            validationType: "required",
          },
        ],
        selections: themes.map((theme$1) => ({
          value: theme$1,
          label: msg`${userFriendlyCase(theme$1)}`,
        })),
      },
    };

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ACCOUNT_VIEW_KEY,
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <BaseAccountLayout>
      <SectionBox title={domainMessages.TEXT_LANG.TITLE}>
        <SchemaForm<IUserPreferences>
          onSubmit={async (data) => {
            setTheme(data.theme);
          }}
          initialValues={{ theme }}
          buttonText={domainMessages.FORM_LANG.UPSERT}
          fields={UPDATE_USER_PREFERENCES_FORM_SCHEMA}
          systemIcon="Save"
        />
      </SectionBox>

      <SectionBox
        title={msg`Language`}
        actionButtons={[
          {
            id: "change-language",
            action:
              "https://github.com/dashpresshq/dashpress/tree/master/src/translations/locales",
            systemIcon: "Help",
            label: msg`I Want To Help With Translation`,
          },
        ]}
      >
        <SchemaForm<{ locale: string }>
          onSubmit={async (data) => {
            const { pathname, asPath, query } = router;

            router.push({ pathname, query }, asPath, { locale: data.locale });

            const date = new Date();
            const expireMs = 100 * 24 * 60 * 60 * 1000; // 100 days
            date.setTime(date.getTime() + expireMs);
            document.cookie = `NEXT_LOCALE=${
              data.locale
            };expires=${date.toUTCString()};path=/`;
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
