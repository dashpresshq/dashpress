import {
  ComponentIsLoading,
  SoftButton,
  Spacer,
  StyledCard,
  Stack,
  Text,
  DeleteButton,
} from "@hadmean/chromista";
import styled from "styled-components";
import { Check, Settings } from "react-feather";
import { useEntitiesCount } from "frontend/hooks/data/data.store";
import { useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import arrayMove from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import { useEffect, useState } from "react";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import { AppLayout } from "../../_layouts/app";
import { NAVIGATION_LINKS } from "../../lib/routing/links";

const StyledBox = styled.div`
  padding: 24px;
`;

const Root = styled.div`
  .list {
    user-select: none;
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-gap: 16px;
  }
  .item {
    cursor: grab;
    user-select: none;
  }
`;

export function Dashboard() {
  const entitiesMenuItems = useEntitiesMenuItems();
  const entitiesCount = useEntitiesCount(
    (entitiesMenuItems?.data || []).map(({ value }) => value)
  );

  const [managingDashboard, setManagingDashboard] = useState(false);

  const [items, setItems] = useState<{ value: string; label: string }[]>([]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems((array) => arrayMove(array, oldIndex, newIndex));
  };

  useEffect(() => {
    setItems(entitiesMenuItems.data || []);
  }, [JSON.stringify(entitiesMenuItems.data || [])]);

  useSetPageDetails({
    pageTitle: "Home",
    viewKey: "HOME",
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const toggleManagingState = () => {
    setManagingDashboard(!managingDashboard);
  };

  return (
    <AppLayout
      actionItems={[
        {
          label: managingDashboard ? " Done " : "Manage Dashboard",
          IconComponent: managingDashboard ? Check : Settings,
          onClick: toggleManagingState,
        },
      ]}
    >
      <ViewStateMachine
        loading={entitiesMenuItems.isLoading}
        error={entitiesMenuItems.error}
        loader={<ComponentIsLoading />}
      >
        <Root>
          <SortableList
            onSortEnd={onSortEnd}
            className="list"
            draggedItemClassName="dragged"
          >
            {items.map((field) => (
              <SortableItem key={field.label}>
                <div className="item">
                  <StyledCard>
                    <StyledBox>
                      <Stack justify="space-between">
                        <Text size="4">{field.label}</Text>
                        <Stack width="auto">
                          {managingDashboard ? (
                            <>
                              <SoftButton
                                action={NAVIGATION_LINKS.ENTITY.TABLE(
                                  field.value
                                )}
                                icon="edit"
                              />
                              <DeleteButton
                                onDelete={() => {}}
                                isMakingDeleteRequest={false}
                                shouldConfirmAlert
                              />
                            </>
                          ) : (
                            <SoftButton
                              action={NAVIGATION_LINKS.ENTITY.TABLE(
                                field.value
                              )}
                              icon="eye"
                            />
                          )}
                        </Stack>
                      </Stack>
                      <Spacer size="xs" />
                      <Text size="3" weight="bold">
                        {entitiesCount.data[field.value]?.isLoading
                          ? "Counting..."
                          : Intl.NumberFormat("en-US").format(
                              entitiesCount.data[field.value]?.data?.count || 0
                            )}
                      </Text>
                    </StyledBox>
                  </StyledCard>
                  <Spacer size="xl" />
                </div>
              </SortableItem>
            ))}
          </SortableList>
        </Root>
      </ViewStateMachine>
    </AppLayout>
  );
}
