import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
  SoftButton,
  Spacer,
} from "@gothicgeeks/design-system";
import { useNavigationStack } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { AppLayout } from "frontend/_layouts/app";
import {
  ENTITY_CRUD_SETTINGS_TAB_LABELS,
  ENTITY_FIELD_SETTINGS_TAB_LABELS,
} from "./constants";

interface IProps {
  children: ReactNode;
}

export function BaseEntitySettingsLayout({ children }: IProps) {
  const entity = useEntitySlug();
  const { canGoBack, goBack } = useNavigationStack();
  const router = useRouter();

  return (
    <AppLayout>
      {canGoBack() && (
        <>
          <SoftButton
            icon="back"
            size="xs"
            label="Go Back"
            action={() => {
              goBack();
            }}
          />
          <Spacer />
        </>
      )}

      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
                name: "Diction",
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
                  tab: ENTITY_CRUD_SETTINGS_TAB_LABELS.CREATE,
                }),
                name: "CRUD",
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
                  tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
                }),
                name: "Fields",
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.RELATIONS(entity),
                name: "Relations",
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.ACTIONS(entity),
                name: "//Actions",
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.ACTIONS(entity),
                name: "//Table Tabs",
              },
              // Computed Table fields
              // Computed Details fields
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
