import {
  Table,
  DEFAULT_TABLE_PARAMS,
  DeleteButton,
  SoftButton,
  Stack,
} from "@gothicgeeks/design-system";
import { IFEPaginatedDataState, useFEPaginatedData } from "@gothicgeeks/shared";
import React, { useState } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { Plus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageTitle } from "frontend/lib/routing";
import router from "next/router";
import { userFriendlyCase } from "frontend/lib/strings";
import { IValueLabel } from "@gothicgeeks/design-system/dist/types";
import { ADMIN_ROLES_ENDPOINT, useRoleDeletionMutation } from "./roles.store";

export function ListRoles() {
  const [paginatedDataState, setPaginatedDataState] = useState<
    IFEPaginatedDataState<IValueLabel>
  >({ ...DEFAULT_TABLE_PARAMS, pageIndex: 1 });

  useSetPageTitle("Manage Roles", "ROLES_LIST");

  const roleDeletionMutation = useRoleDeletionMutation();

  const MemoizedAction = React.useCallback(
    ({ row }: any) => (
      <Stack spacing={4} align="center">
        <SoftButton
          action={NAVIGATION_LINKS.ROLES.DETAILS(
            (row.original as unknown as IValueLabel).value
          )}
          label="Details"
          color="primary"
          justIcon
          icon="eye"
        />
        <DeleteButton
          onDelete={() =>
            roleDeletionMutation.mutateAsync(
              (row.original as unknown as IValueLabel).value
            )
          }
          isMakingDeleteRequest={roleDeletionMutation.isLoading}
          shouldConfirmAlert
        />
      </Stack>
    ),
    [roleDeletionMutation.isLoading]
  );

  const tableData = useFEPaginatedData<Record<string, unknown>>(
    ADMIN_ROLES_ENDPOINT,
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
        title="Roles"
        {...{
          tableData,
          setPaginatedDataState,
          paginatedDataState,
        }}
        columns={[
          {
            Header: "Role",
            accessor: "label",
            Cell: (value) => userFriendlyCase(value.value as string),
          },
          {
            Header: "Action",
            Cell: MemoizedAction,
          },
        ]}
        menuItems={[
          {
            label: "Add New Role",
            IconComponent: Plus,
            onClick: () => {
              router.push(NAVIGATION_LINKS.ROLES.CREATE);
            },
          },
        ]}
      />
    </AppLayout>
  );
}
