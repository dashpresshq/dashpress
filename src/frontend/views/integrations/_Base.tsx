import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Book, UploadCloud, Zap, ZapOff } from "react-feather";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import {
  ListManager,
  ListManagerItem,
} from "frontend/design-system/components/ListManager";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { MenuSection } from "frontend/design-system/components/Section/MenuSection";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "./actions/actions.store";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "./actions/constants";
import { STORAGE_INTEGRATIONS_CRUD_CONFIG } from "./storage/constants";

interface IProps {
  children: ReactNode;
}

export function BaseActionsLayout({ children }: IProps) {
  const currentKey = useRouteParam("key");

  const actionIntegrationsList = useActionIntegrationsList();
  const activeActionList = useActiveActionList();

  const router = useRouter();

  const activeList = [
    ...activeActionList.data.map(({ integrationKey }) => integrationKey),
  ] as string[];

  return (
    <AppLayout>
      <ContentLayout>
        <ContentLayout.Left>
          <SectionBox title={ACTION_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.TITLE}>
            <ListManager
              items={actionIntegrationsList}
              listLengthGuess={7}
              labelField="title"
              render={(menuItem) => {
                const isActive = activeList.includes(menuItem.key);
                return (
                  <ListManagerItem
                    label={menuItem.title}
                    key={menuItem.key}
                    IconComponent={isActive ? Zap : ZapOff}
                    active={menuItem.key === currentKey}
                    subtle={!isActive}
                    action={NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(menuItem.key)}
                  />
                );
              }}
            />
          </SectionBox>
          <Spacer />
          <MenuSection
            menuItems={[
              {
                action: NAVIGATION_LINKS.INTEGRATIONS.STORAGE,
                name: STORAGE_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.TITLE,
                IconComponent: UploadCloud,
              },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
          <Spacer />
          <MenuSection
            menuItems={[
              {
                action: NAVIGATION_LINKS.INTEGRATIONS.VARIABLES,
                name: "Variables",
                IconComponent: Book,
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
