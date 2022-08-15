import {
  Table,
  DEFAULT_TABLE_PARAMS,
  DeleteButton,
  SoftButton,
  Stack,
} from "@adminator/chromista";
import { IFEPaginatedDataState, useFEPaginatedData } from "@adminator/protozoa";
import React, { useState } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { UserPlus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import router from "next/router";
import { IAccountUser, USER_PERMISSIONS } from "shared/types";
import { userFriendlyCase } from "frontend/lib/strings";
import {
  ADMIN_USERS_LIST_ENDPOINT,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IAccountUser>
  >({ ...DEFAULT_TABLE_PARAMS, pageIndex: 1 });

  useSetPageDetails({
    pageTitle: "Manage User",
    viewKey: "USERS_LIST",
    permission: USER_PERMISSIONS.CAN_MANAGE_USER,
  });

  const userDeletionMutation = useUserDeletionMutation();

  const MemoizedAction = React.useCallback(
    ({ row }: any) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={NAVIGATION_LINKS.USERS.DETAILS(
            (row.original as unknown as IAccountUser).username
          )}
          label="Details"
          color="primary"
          justIcon
          icon="eye"
        />
        <DeleteButton
          onDelete={() =>
            userDeletionMutation.mutateAsync(
              (row.original as unknown as IAccountUser).username
            )
          }
          isMakingDeleteRequest={userDeletionMutation.isLoading}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [userDeletionMutation.isLoading]
  );

  const tableData = useFEPaginatedData<Record<string, unknown>>(
    ADMIN_USERS_LIST_ENDPOINT,
    {
      ...paginatedDataState,
      sortBy: undefined,
      pageIndex: 1,
      filters: undefined,
    }
  );

  return (
    <AppLayout>
      <Table
        title="Users"
        {...{
          tableData,
          setPaginatedDataState,
          paginatedDataState,
        }}
        columns={[
          {
            Header: "Username",
            accessor: "username",
          },
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Role",
            accessor: "role",
            Cell: (value) => userFriendlyCase(value.value as string),
          },
          {
            Header: "Action",
            Cell: MemoizedAction,
          },
        ]}
        menuItems={[
          {
            label: "Add New User",
            IconComponent: UserPlus,
            onClick: () => {
              router.push(NAVIGATION_LINKS.USERS.CREATE);
            },
          },
        ]}
      />
    </AppLayout>
  );
}
