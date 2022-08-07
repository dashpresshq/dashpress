import {
  Table,
  DEFAULT_TABLE_PARAMS,
  DeleteButton,
  SoftButton,
  Stack,
} from "@gothicgeeks/design-system";
import { IFEPaginatedDataState, useFEPaginatedData } from "@gothicgeeks/shared";
import { useState } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { UserPlus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageTitle } from "frontend/lib/routing";
import router from "next/router";
import { IAccountUser } from "shared/types";
import {
  ADMIN_USERS_LIST_ENDPOINT,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IAccountUser>
  >({ ...DEFAULT_TABLE_PARAMS, pageIndex: 1 });

  useSetPageTitle("Manage Users", "USERS_LIST");

  const userDeletionMutation = useUserDeletionMutation();

  const tableData = useFEPaginatedData(ADMIN_USERS_LIST_ENDPOINT, {
    ...paginatedDataState,
    sortBy: undefined,
    pageIndex: 1,
    filters: undefined,
  });

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
          },
          {
            Header: "Action",
            // eslint-disable-next-line react/no-unstable-nested-components
            Cell: ({ row }: { row: { original: unknown } }) => (
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
                    userDeletionMutation.mutate(
                      (row.original as unknown as IAccountUser).username
                    )
                  }
                  isMakingDeleteRequest={userDeletionMutation.isLoading}
                  shouldConfirmAlert
                />
              </Stack>
            ),
          },
        ]}
        menuItems={[
          {
            label: "Add new user",
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
