import {
  SectionLeft,
  SectionRight,
  SectionRow,
  SectionListItem,
  SectionBox,
  ListSkeleton,
  RenderList,
  Spacer,
  MenuSection,
} from "@hadmean/chromista";
import { useRouteParam } from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Book, Cloud, UploadCloud, Zap, ZapOff } from "react-feather";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "./actions/actions.store";
import {
  useActiveStorageIntegrationList,
  useStorageIntegrationsList,
} from "./storage/storage.store";

interface IProps {
  children: ReactNode;
}

export function BaseActionsLayout({ children }: IProps) {
  const currentKey = useRouteParam("key");

  const actionIntegrationsList = useActionIntegrationsList();
  const activeActionList = useActiveActionList();

  const storageIntegrationsList = useStorageIntegrationsList();
  const activeStorageIntegrationList = useActiveStorageIntegrationList();

  const router = useRouter();

  const activeList = [
    ...(activeActionList.data || []).map(
      ({ integrationKey }) => integrationKey
    ),
  ];

  return (
    <AppLayout>
      <SectionRow>
        <SectionLeft>
          <SectionBox title="Actions">
            <ViewStateMachine
              loading={
                actionIntegrationsList.isLoading || activeActionList.isLoading
              }
              error={actionIntegrationsList.error || activeActionList.error}
              loader={<ListSkeleton count={7} />}
            >
              <RenderList
                items={(actionIntegrationsList.data || []).map(
                  ({ title, key }) => ({
                    name: title,
                    key,
                  })
                )}
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

          <SectionBox title="File Storage">
            <ViewStateMachine
              loading={
                storageIntegrationsList.isLoading ||
                activeStorageIntegrationList.isLoading
              }
              error={
                storageIntegrationsList.error ||
                activeStorageIntegrationList.error
              }
              loader={<ListSkeleton count={7} />}
            >
              <RenderList
                items={(storageIntegrationsList.data || []).map(
                  ({ title, key }) => ({
                    name: title,
                    key,
                  })
                )}
                render={(menuItem) => {
                  const isActive = (
                    activeStorageIntegrationList.data || []
                  ).includes(menuItem.key);
                  return (
                    <SectionListItem
                      label={menuItem.name}
                      key={menuItem.key}
                      IconComponent={isActive ? UploadCloud : Cloud}
                      active={menuItem.key === currentKey}
                      subtle={!isActive}
                      action={NAVIGATION_LINKS.INTEGRATIONS.STORAGE(
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
                action: NAVIGATION_LINKS.INTEGRATIONS.VARIABLES,
                name: "Variables",
                IconComponent: Book,
              },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />

          <Spacer />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
