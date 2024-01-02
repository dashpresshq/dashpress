import React from "react";
import { AppLayout } from "frontend/_layouts/app";
import { UserPlus } from "react-feather";
import { useRouter } from "next/router";
import { roleLabel, USER_PERMISSIONS } from "shared/constants/user";
import {
  FEPaginationTable,
  IFETableColumn,
  IFETableCell,
} from "frontend/components/FEPaginationTable";
import { IRolesList } from "shared/types/roles";
import { IAccountProfile } from "shared/types/user";
import { useApi } from "frontend/lib/data/useApi";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { DeleteButton } from "frontend/design-system/components/Button/DeleteButton";
import { Card } from "frontend/design-system/components/Card";
import { ADMIN_ROLES_CRUD_CONFIG } from "../roles/roles.store";
import {
  ADMIN_USERS_CRUD_CONFIG,
  useAllUsers,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
  const router = useRouter();

  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.TITLE,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  const roles = useApi<IRolesList[]>(ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.LIST, {
    defaultData: [],
  });

  const allUsers = useAllUsers();

  const rootProfileKeys = Object.keys(
    JSON.parse(allUsers.data[0]?.systemProfile || "{}")
  );

  const userDeletionMutation = useUserDeletionMutation();

  const MemoizedAction = React.useCallback(
    ({ row }: IFETableCell<IAccountProfile>) => {
      const { username } = row.original;
      return (
        <Stack spacing={4} align="center">
          <SoftButton
            action={NAVIGATION_LINKS.USERS.DETAILS(username)}
            label="Edit"
            justIcon
            icon="edit"
          />
          <DeleteButton
            onDelete={() => userDeletionMutation.mutateAsync(username)}
            isMakingDeleteRequest={false}
            shouldConfirmAlert
          />
        </Stack>
      );
    },
    [userDeletionMutation.isLoading]
  );

  const extendedProfileColumns: IFETableColumn<IAccountProfile>[] =
    rootProfileKeys.map((profileKey) => ({
      Header: userFriendlyCase(profileKey),
      accessor: profileKey as keyof IAccountProfile,
      filter: undefined,
      disableSortBy: true,
      Cell: ({ row }) =>
        JSON.parse(row.original.systemProfile || "{}")[profileKey],
    }));

  const columns: IFETableColumn<IAccountProfile>[] = [
    {
      Header: "Username",
      accessor: "username",
      filter: {
        _type: "string",
        bag: undefined,
      },
    },
    {
      Header: "Name",
      accessor: "name",
      filter: {
        _type: "string",
        bag: undefined,
      },
    },
    {
      Header: "Role",
      accessor: "role",
      filter: {
        _type: "status",
        bag: roles.data,
      },
      Cell: ({ value }) => roleLabel(value as string),
    },
    ...extendedProfileColumns,
    {
      Header: "Action",
      disableSortBy: true,
      accessor: "__action__",
      Cell: MemoizedAction,
    },
  ];

  return (
    <AppLayout
      actionItems={[
        {
          id: "add",
          label: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
          IconComponent: UserPlus,
          onClick: () => {
            router.push(NAVIGATION_LINKS.USERS.CREATE);
          },
        },
      ]}
    >
      <Card>
        <FEPaginationTable
          dataEndpoint={ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST}
          columns={columns}
          empty={{
            text: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EMPTY_LIST,
            createNew: {
              label: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
              action: NAVIGATION_LINKS.USERS.CREATE,
            },
          }}
        />
      </Card>
    </AppLayout>
  );
}
