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
import { IAccountProfile, USER_PERMISSIONS } from "shared/types/user";
import { userFriendlyCase } from "frontend/lib/strings";
import { FEPaginationTable } from "frontend/lib/FEPaginationTable";
import {
  ADMIN_USERS_LIST_ENDPOINT,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
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
        <FEPaginationTable<IAccountProfile>
          dataEndpoint={ADMIN_USERS_LIST_ENDPOINT}
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
      </StyledCard>
    </AppLayout>
  );
}
