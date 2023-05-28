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
import {
  FEPaginationTable,
  IFETableCell,
  IFETableColumn,
} from "frontend/components/FEPaginationTable";
import { SystemRoles } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import {
  ADMIN_ROLES_CRUD_CONFIG,
  useRoleDeletionMutation,
} from "./roles.store";

export function ListRoles() {
  const router = useRouter();

  useSetPageDetails({
    pageTitle: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.TITLE,
    permission: USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS,
  });

  const roleDeletionMutation = useRoleDeletionMutation();

  const MemoizedAction = useCallback(
    ({ row }: IFETableCell<IRolesList>) => {
      const roleId = row.original.value;
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
            isMakingDeleteRequest={false}
            shouldConfirmAlert
          />
        </Stack>
      );
    },
    [roleDeletionMutation.isLoading]
  );
  const columns: IFETableColumn<IRolesList>[] = [
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
  ];

  return (
    <AppLayout
      actionItems={[
        {
          id: "add",
          label: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.CREATE,
          IconComponent: Plus,
          onClick: () => {
            router.push(NAVIGATION_LINKS.ROLES.CREATE);
          },
        },
      ]}
    >
      <StyledCard>
        <FEPaginationTable
          dataEndpoint={ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.LIST}
          emptyMessage={ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.EMPTY_LIST}
          columns={columns}
        />
      </StyledCard>
    </AppLayout>
  );
}
