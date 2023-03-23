import {
  DeleteButton,
  SoftButton,
  Stack,
  StyledCard,
} from "@hadmean/chromista";
import { useCallback } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { Plus } from "react-feather";
import { NAVIGATION_LINKS, useSetPageDetails } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { FEPaginationTable } from "frontend/components/FEPaginationTable";
import { IValueLabel } from "@hadmean/chromista/dist/types";
import { SystemRoles } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ADMIN_ROLES_ENDPOINT, useRoleDeletionMutation } from "./roles.store";

export function ListRoles() {
  const router = useRouter();

  useSetPageDetails({
    pageTitle: "Roles",
    viewKey: "ROLES_LIST",
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  const roleDeletionMutation = useRoleDeletionMutation();

  const MemoizedAction = useCallback(
    ({ row }: any) => {
      const roleId = (row.original as unknown as IValueLabel).value;
      if ((Object.values(SystemRoles) as string[]).includes(roleId)) {
        return null;
      }
      return (
        <Stack spacing={4} align="center">
          <SoftButton
            action={NAVIGATION_LINKS.ROLES.DETAILS(roleId)}
            label="Edit"
            justIcon
            icon="edit"
          />
          <DeleteButton
            onDelete={() => roleDeletionMutation.mutateAsync(roleId)}
            isMakingDeleteRequest={roleDeletionMutation.isLoading}
            shouldConfirmAlert
          />
        </Stack>
      );
    },
    [roleDeletionMutation.isLoading]
  );

  return (
    <AppLayout
      actionItems={[
        {
          id: "add",
          label: "Add New Role",
          IconComponent: Plus,
          onClick: () => {
            router.push(NAVIGATION_LINKS.ROLES.CREATE);
          },
        },
      ]}
    >
      <StyledCard>
        <FEPaginationTable
          dataEndpoint={ADMIN_ROLES_ENDPOINT}
          columns={[
            {
              Header: "Role",
              accessor: "label",
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
