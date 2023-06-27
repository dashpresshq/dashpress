import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { AppLayout } from "frontend/_layouts/app";
import {
  Code,
  Link2,
  Type,
  Filter,
  Sliders,
  File,
  Zap,
  Codepen,
} from "react-feather";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { MenuSection } from "frontend/design-system/components/Section/MenuSection";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { ADMIN_ACTION_INSTANCES_CRUD_CONFIG } from "./Actions/constants";
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

  const baseMenuItems = [
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity, {
        tab: ENTITY_CRUD_SETTINGS_TAB_LABELS.CREATE,
      }),
      IconComponent: Sliders,
      name: "CRUD",
    },
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
      name: "Diction",
      IconComponent: Type,
    },
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity, {
        tab: ENTITY_FIELD_SETTINGS_TAB_LABELS.LABELS,
      }),
      name: "Fields",
      IconComponent: File,
    },
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.RELATIONS(entity),
      name: "Relations",
      IconComponent: Link2,
    },
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.VIEWS(entity),
      name: "Views",
      IconComponent: Filter,
    },
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.FORM(entity),
      name: "Form Scripts",
      IconComponent: Code,
    },
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.PRESENTATION(entity),
      name: "Presentation Scripts",
      IconComponent: Codepen,
    },
    {
      action: NAVIGATION_LINKS.ENTITY.CONFIG.FORM_INTEGRATIONS(entity),
      name: ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.TITLE,
      IconComponent: Zap,
    },
  ];

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

      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection
            menuItems={baseMenuItems}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
