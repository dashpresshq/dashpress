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
import { Book, Zap, ZapOff } from "react-feather";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "./actions.store";

interface IProps {
  children: ReactNode;
}

export function BaseActionsLayout({ children }: IProps) {
  const currentKey = useRouteParam("key");

  const actionIntegrationsList = useActionIntegrationsList();

  const router = useRouter();

  const activeActionList = useActiveActionList();

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
                      action={NAVIGATION_LINKS.ACTIONS.DETAILS(menuItem.key)}
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
                action: NAVIGATION_LINKS.ACTIONS.VARIABLES,
                name: "Variables",
                IconComponent: Book,
              },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />

          <Spacer />

          <SectionBox title="File Storage">
            <MenuSection
              menuItems={[
                {
                  action: NAVIGATION_LINKS.ACTIONS.VARIABLES,
                  name: "AWS S3",
                  IconComponent: Book,
                },
                {
                  action: NAVIGATION_LINKS.ACTIONS.VARIABLES,
                  name: "Firebase Storage",
                  IconComponent: Book,
                },
                {
                  action: NAVIGATION_LINKS.ACTIONS.VARIABLES,
                  name: "Minio",
                  IconComponent: Book,
                },
                {
                  action: NAVIGATION_LINKS.ACTIONS.VARIABLES,
                  name: "Cloudinary",
                  IconComponent: Book,
                },
                {
                  action: NAVIGATION_LINKS.ACTIONS.VARIABLES,
                  name: "Google Cloud Storage",
                  IconComponent: Book,
                },
              ]}
              currentMenuItem={router.asPath.split("?")[0]}
            />
          </SectionBox>
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
