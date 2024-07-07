import { msg } from "@lingui/macro";
import type { ReactNode } from "react";

import { SoftButton } from "@/components/app/button/soft";
import type { IMenuActionItem } from "@/components/app/button/types";
import { ContentLayout } from "@/components/app/content-layout";
import { MenuSection } from "@/components/app/menu-section";
import { AppLayout } from "@/frontend/_layouts/app";
import { useEntitySlug } from "@/frontend/hooks/entity/entity.config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { NAVIGATION_LINKS } from "@/frontend/lib/routing/links";
import { useNavigationStack } from "@/frontend/lib/routing/useNavigationStack";

import { useMutateBaseEntitySettingsMenu } from "./portal";

const baseMenuItems = (entity: string): IMenuActionItem[] => [
  {
    id: "crud",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity),
    systemIcon: "Sliders",
    label: msg`CRUD`,
    order: 10,
  },
  {
    id: "diction",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
    label: msg`Diction`,
    systemIcon: "Type",
    order: 20,
  },
  {
    id: "fields",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity),
    label: msg`Fields`,
    systemIcon: "File",
    order: 30,
  },
  {
    id: "relations",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.RELATIONS(entity),
    label: msg`Relations`,
    systemIcon: "LinkAlt",
    order: 40,
  },
  {
    id: "views",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.VIEWS(entity),
    label: msg`Table Views`,
    systemIcon: "Filter",
    order: 50,
  },
  {
    id: "queries",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.PERSISTENT_QUERY(entity),
    label: msg`Persistent Query`,
    systemIcon: "Shield",
    order: 51,
  },
  {
    id: "scripts",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.FORM(entity),
    label: msg`Form Scripts`,
    systemIcon: "Code",
    order: 60,
  },
  {
    id: "presentation",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.PRESENTATION(entity),
    label: msg`Presentation Scripts`,
    systemIcon: "CodeAlt",
    order: 70,
  },
  {
    id: "integrations",
    action: NAVIGATION_LINKS.ENTITY.CONFIG.FORM_INTEGRATIONS(entity),
    label: LANG_DOMAINS.INTEGRATIONS.FORM_ACTIONS.plural,
    systemIcon: "Zap",
    order: 80,
  },
];

interface IProps {
  children: ReactNode;
  actionItems?: IMenuActionItem[];
}

export function BaseEntitySettingsLayout({ children, actionItems }: IProps) {
  const entity = useEntitySlug();
  const { canGoBack, goBack } = useNavigationStack();

  const menuItems = useMutateBaseEntitySettingsMenu(
    entity,
    baseMenuItems(entity)
  );

  return (
    <AppLayout actionItems={actionItems}>
      {canGoBack() && (
        <SoftButton
          systemIcon="Left"
          size="sm"
          className="mb-2"
          label={msg`Go Back`}
          action={() => {
            goBack();
          }}
        />
      )}
      <ContentLayout>
        <ContentLayout.Left>
          <MenuSection menuItems={menuItems} />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
