import {
  Table,
  DEFAULT_TABLE_PARAMS,
  DeleteButton,
  SoftButton,
  Stack,
  TableSkeleton,
  StyledCard,
} from "@hadmean/chromista";
import {
  IBEPaginatedDataState,
  IFEPaginatedDataState,
  useFEPaginatedData,
} from "@hadmean/protozoa";
import React, { useState } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { UserPlus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { IAccountProfile, USER_PERMISSIONS } from "shared/types/user";
import { userFriendlyCase } from "frontend/lib/strings";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { createFEPaginationOptions } from "frontend/lib/pagination";
import {
  ADMIN_USERS_LIST_ENDPOINT,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IAccountProfile> | IBEPaginatedDataState
  >(DEFAULT_TABLE_PARAMS);

  const tableData = useFEPaginatedData<IAccountProfile>(
    ADMIN_USERS_LIST_ENDPOINT,
    createFEPaginationOptions(paginatedDataState)
  );

  const router = useRouter();

  useSetPageDetails({
    pageTitle: "Users",
    viewKey: "USERS_LIST",
    permission: USER_PERMISSIONS.CAN_MANAGE_USER,
  });

  const userDeletionMutation = useUserDeletionMutation();

  const MemoizedAction = React.useCallback(
    ({ row }: any) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={NAVIGATION_LINKS.USERS.DETAILS(
            (row.original as unknown as IAccountProfile).username
          )}
          label="Edit"
          justIcon
          icon="edit"
        />
        <DeleteButton
          onDelete={() =>
            userDeletionMutation.mutateAsync(
              (row.original as unknown as IAccountProfile).username
            )
          }
          isMakingDeleteRequest={userDeletionMutation.isLoading}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [userDeletionMutation.isLoading]
  );

  return (
    <AppLayout
      actionItems={[
        {
          label: "Add New User",
          IconComponent: UserPlus,
          onClick: () => {
            router.push(NAVIGATION_LINKS.USERS.CREATE);
          },
        },
      ]}
    >
      <StyledCard>
        <ViewStateMachine
          error={tableData.error}
          loading={tableData.isLoading}
          loader={<TableSkeleton />}
        >
          <Table
            {...{
              tableData,
              setPaginatedDataState,
              paginatedDataState,
            }}
            columns={[
              {
                Header: "Username",
                accessor: "username",
                disableSortBy: true,
              },
              {
                Header: "Name",
                accessor: "name",
                disableSortBy: true,
              },
              {
                Header: "Role",
                accessor: "role",
                disableSortBy: true,
                Cell: (value) => userFriendlyCase(value.value as string),
              },
              {
                Header: "Action",
                Cell: MemoizedAction,
              },
            ]}
          />
        </ViewStateMachine>
      </StyledCard>
    </AppLayout>
  );
}
