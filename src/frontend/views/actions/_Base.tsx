import {
  SectionLeft,
  SectionRight,
  SectionRow,
  SectionListItem,
  SectionBox,
  ListSkeleton,
  RenderList,
} from "@hadmean/chromista";
import { useRouteParam } from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { ReactNode } from "react";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { AppLayout } from "../../_layouts/app";
import { useActionsList, useActiveActionList } from "./actions.store";
import { DEFAULT_ACTION_KEY } from "./constants";

interface IProps {
  children: ReactNode;
}

export function BaseActionsLayout({ children }: IProps) {
  const currentKey = useRouteParam("key") || DEFAULT_ACTION_KEY;

  const actionsList = useActionsList();

  const activeActionList = useActiveActionList();

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
                singular=""
                render={(menuItem) => {
                  return (
                    <SectionListItem
                      label={menuItem.name}
                      key={menuItem.name}
                      active={menuItem.key === currentKey}
                      action={NAVIGATION_LINKS.ACTIONS.DETAILS(menuItem.key)}
                    />
                  );
                }}
              />
            </ViewStateMachine>
          </SectionBox>
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
