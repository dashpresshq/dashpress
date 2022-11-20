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
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Code, Zap, ZapOff } from "react-feather";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";
import { useActionsList, useActiveActionList } from "./actions.store";

interface IProps {
  children: ReactNode;
}

export function BaseActionsLayout({ children }: IProps) {
  const currentKey = useRouteParam("key");

  const actionsList = useActionsList();

  const router = useRouter();

  const activeActionList = useActiveActionList();

  const activeList = [
    ...(activeActionList.data || []).map(
      ({ integrationKey }) => integrationKey
    ),
    "http",
  ];

  return (
    <AppLayout>
      <SectionRow>
        <SectionLeft>
          <SectionBox headLess title="">
            <ViewStateMachine
              loading={actionsList.isLoading || activeActionList.isLoading}
              error={actionsList.error || activeActionList.error}
              loader={<ListSkeleton />}
            >
              <RenderList
                items={(actionsList.data || []).map(({ title, key }) => ({
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
                action: NAVIGATION_LINKS.ACTIONS.CONSTANTS,
                name: "Manage Constants",
                IconComponent: Code,
              },
            ]}
            currentMenuItem={router.asPath.split("?")[0]}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
