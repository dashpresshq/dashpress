import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import type { ReactNode } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { ContentLayout } from "@/components/app/content-layout";
import { fakeMessageDescriptor } from "@/translations/fake";
import { MenuSection } from "@/components/app/menu-section";
import { ListSkeleton } from "@/components/app/skeleton/list";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { Card, CardContent } from "@/components/ui/card";
import {
  useIntegrationsList,
  useActiveIntegrations,
} from "./actions/actions.store";

interface IProps {
  children: ReactNode;
}

export function BaseActionsLayout({ children }: IProps) {
  const fileStorageDomainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FILE_STORAGE
  );

  const currentKey = useRouteParam("key");

  const integrationsList = useIntegrationsList();
  const activeIntegrations = useActiveIntegrations();

  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <ViewStateMachine
            loading={integrationsList.isLoading}
            error={integrationsList.error}
            loader={
              <Card>
                <CardContent>
                  <ListSkeleton count={8} />
                </CardContent>
              </Card>
            }
          >
            <MenuSection
              menuItems={integrationsList.data.map((menuitem) => {
                const isActive = activeIntegrations.data.includes(menuitem.key);
                return {
                  id: menuitem.key,
                  action: NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(menuitem.key),
                  label: fakeMessageDescriptor(menuitem.title),
                  subtle: !isActive,
                  active: menuitem.key === currentKey,
                  systemIcon: isActive ? "Zap" : "ZapOff",
                };
              })}
            />
          </ViewStateMachine>

          <MenuSection
            menuItems={[
              {
                id: "storage",
                action: NAVIGATION_LINKS.INTEGRATIONS.STORAGE,
                label: fileStorageDomainMessages.TEXT_LANG.TITLE,
                systemIcon: "Upload",
              },
            ]}
          />
          <MenuSection
            menuItems={[
              {
                id: "variables",
                action: NAVIGATION_LINKS.INTEGRATIONS.VARIABLES,
                label: msg`Variables`,
                systemIcon: "Book",
              },
            ]}
          />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
