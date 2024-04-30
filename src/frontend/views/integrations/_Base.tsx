import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { ListManager } from "frontend/design-system/components/ListManager";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { MenuSection } from "frontend/design-system/components/Section/MenuSection";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { IListMangerItemProps } from "frontend/design-system/components/ListManager/ListManagerItem";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
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
  const actionsDomainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.ACTIONS
  );

  const currentKey = useRouteParam("key");

  const integrationsList = useIntegrationsList();
  const activeIntegrations = useActiveIntegrations();

  const router = useRouter();

  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <SectionBox title={actionsDomainMessages.TEXT_LANG.TITLE}>
            <ListManager
              items={integrationsList}
              listLengthGuess={7}
              labelField="title"
              render={(menuItem) => {
                const isActive = activeIntegrations.data.includes(menuItem.key);
                const props: IListMangerItemProps = {
                  label: menuItem.title,
                  systemIcon: isActive ? "Zap" : "ZapOff",
                  active: menuItem.key === currentKey,
                  subtle: !isActive,
                  action: NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(menuItem.key),
                };

                return props;
              }}
            />
          </SectionBox>
          <Spacer />
          <MenuSection
            menuItems={[
              {
                action: NAVIGATION_LINKS.INTEGRATIONS.STORAGE,
                name: fileStorageDomainMessages.TEXT_LANG.TITLE,
                systemIcon: "Upload",
              },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
          <Spacer />
          <MenuSection
            menuItems={[
              {
                action: NAVIGATION_LINKS.INTEGRATIONS.VARIABLES,
                name: msg`Variables`,
                systemIcon: "Book",
              },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />

          <Spacer />
        </ContentLayout.Left>
        <ContentLayout.Right>{children}</ContentLayout.Right>
      </ContentLayout>
    </AppLayout>
  );
}
