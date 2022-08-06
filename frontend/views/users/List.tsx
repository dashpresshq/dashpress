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
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import router from "next/router";
import {
  ADMIN_USERS_LIST_ENDPOINT,
  useUserDeletionMutation,
} from "./users.store";
import { IAccountUser } from "./types";

export function ListUsers() {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IAccountUser>
  >({ ...DEFAULT_TABLE_PARAMS, sortBy: undefined });

  const userDeletionMutation = useUserDeletionMutation();

  const tableData = useFEPaginatedData(ADMIN_USERS_LIST_ENDPOINT, {
    ...paginatedDataState,
    sortBy: undefined,
    filters: undefined,
  });

  console.log(tableData);

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
            Cell: ({ row }: { row: { original: IAccountUser } }) => (
              <Stack spacing={4} align="center">
                <SoftButton
                  action={NAVIGATION_LINKS.USERS.DETAILS(row.original.username)}
                  label="Details"
                  color="primary"
                  justIcon
                  icon="eye"
                />
                <DeleteButton
                  onDelete={() =>
                    userDeletionMutation.mutate(row.original.username)
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
              router.push("/");
            },
          },
        ]}
      />
    </AppLayout>
  );
}
