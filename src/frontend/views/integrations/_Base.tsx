import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { ContentLayout } from "@/components/app/content-layout";
import {
  useIntegrationsList,
  useActiveIntegrations,
} from "./actions/actions.store";
import { fakeMessageDescriptor } from "@/translations/fake";
import { MenuSection } from "@/components/app/menu-section";

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

  const router = useRouter();

  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <div className="flex flex-col gap-2">
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
              currentMenuItem={router.asPath.split("?")[0]}
            />

            <MenuSection
              menuItems={[
                {
                  id: "storage",
                  action: NAVIGATION_LINKS.INTEGRATIONS.STORAGE,
                  label: fileStorageDomainMessages.TEXT_LANG.TITLE,
                  systemIcon: "Upload",
                },
              ]}
              currentMenuItem={router.asPath.split("?")[0]}
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
              currentMenuItem={router.asPath.split("?")[0]}
            />
          </div>
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
