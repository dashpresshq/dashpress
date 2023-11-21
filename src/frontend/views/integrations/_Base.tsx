import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Book, UploadCloud, Zap, ZapOff } from "react-feather";
import { ContentLayout } from "frontend/design-system/components/Section/SectionDivider";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { ListSkeleton } from "frontend/design-system/components/Skeleton/List";
import { RenderList } from "frontend/design-system/components/RenderList";
import { SectionListItem } from "frontend/design-system/components/Section/SectionList";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { MenuSection } from "frontend/design-system/components/Section/MenuSection";
import { AppLayout } from "frontend/_layouts/app";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "./actions/actions.store";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "./actions/constants";

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
            <ViewStateMachine
              loading={
                actionIntegrationsList.isLoading || activeActionList.isLoading
              }
              error={actionIntegrationsList.error || activeActionList.error}
              loader={<ListSkeleton count={7} />}
            >
              <RenderList
                items={actionIntegrationsList.data.map(({ title, key }) => ({
                  name: title,
                  key,
                }))}
                render={(menuItem) => {
                  const isActive = activeList.includes(menuItem.key);
                  return (
                    <SectionListItem
                      label={menuItem.name}
                      key={menuItem.key}
                      IconComponent={isActive ? Zap : ZapOff}
                      active={menuItem.key === currentKey}
                      subtle={!isActive}
                      action={NAVIGATION_LINKS.INTEGRATIONS.ACTIONS(
                        menuItem.key
                      )}
                    />
                  );
                }}
              />
            </ViewStateMachine>
          </SectionBox>
          <Spacer />
          <MenuSection
            menuItems={[
              {
                action: NAVIGATION_LINKS.INTEGRATIONS.STORAGE,
                name: "File Storage",
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
