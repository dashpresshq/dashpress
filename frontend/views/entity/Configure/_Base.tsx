import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
  SoftButton,
  Spacer,
} from "@gothicgeeks/design-system";
import { useGoBackContext } from "frontend/lib/routing/useGoBackContext";
import { ReactNode } from "react";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { AppLayout } from "../../../_layouts/app";
import {
  ENTITY_CRUD_SETTINGS_TAB_LABELS,
  ENTITY_FIELD_SETTINGS_TAB_LABELS,
} from "./constants";

interface IProps {
  children: ReactNode;
  menuItem: { link: string; name: string };
}

export function BaseEntitySettingsLayout({ children, menuItem }: IProps) {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const { canGoBack, goBack } = useGoBackContext();

  return (
    <AppLayout
      titleNeedsContext
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        { label: menuItem.name, value: menuItem.link },
      ]}
    >
      {canGoBack() && (
        <>
          <SoftButton
            icon="back"
            size="xs"
            label="Go Back"
            onClick={() => {
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
            currentMenuItem={menuItem.link}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
