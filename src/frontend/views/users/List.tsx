import {
  DeleteButton,
  SoftButton,
  Stack,
  StyledCard,
} from "@hadmean/chromista";
import React from "react";
import { AppLayout } from "frontend/_layouts/app";
import { UserPlus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { roleLabel, USER_PERMISSIONS } from "shared/constants/user";
import {
  FEPaginationTable,
  IFETableColumn,
  IFETableCell,
} from "frontend/components/FEPaginationTable";
import { useApi } from "@hadmean/protozoa";
import { IRolesList } from "shared/types/roles";
import { IAccountProfile } from "shared/types/user";
import {
  ADMIN_USERS_CRUD_CONFIG,
  useUserDeletionMutation,
} from "./users.store";
import { ADMIN_ROLES_CRUD_CONFIG } from "../roles/roles.store";

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
      <StyledCard>
        <FEPaginationTable
          dataEndpoint={ADMIN_USERS_CRUD_CONFIG.ENDPOINTS.LIST}
          columns={columns}
          emptyMessage={ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EMPTY_LIST}
        />
      </StyledCard>
    </AppLayout>
  );
}
