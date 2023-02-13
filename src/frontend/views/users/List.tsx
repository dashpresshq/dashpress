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
import { FEPaginationTable } from "frontend/components/FEPaginationTable";
import {
  ADMIN_USERS_LIST_ENDPOINT,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
  const router = useRouter();

  useSetPageDetails({
    pageTitle: "Users",
    viewKey: "USERS_LIST",
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
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
              // TODO use role list
              Header: "Role",
              accessor: "role",
              filter: {
                _type: "string",
                bag: undefined,
              },
            },
            {
              Header: "Action",
              disableSortBy: true,
              accessor: "__action__",
              Cell: MemoizedAction,
            },
          ]}
        />
      </StyledCard>
    </AppLayout>
  );
}
