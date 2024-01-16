import { useCallback } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import {
  FEPaginationTable,
  IFETableCell,
  IFETableColumn,
} from "frontend/components/FEPaginationTable";
import { SystemRoles } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { DeleteButton } from "frontend/design-system/components/Button/DeleteButton";
import { Card } from "frontend/design-system/components/Card";
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
            systemIcon="Edit"
            justIcon
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
          systemIcon: "Plus",
          onClick: () => {
            router.push(NAVIGATION_LINKS.ROLES.CREATE);
          },
        },
      ]}
    >
      <Card>
        <FEPaginationTable
          dataEndpoint={ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.LIST}
          columns={columns}
          empty={{
            text: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.EMPTY_LIST,
            createNew: {
              label: ADMIN_ROLES_CRUD_CONFIG.TEXT_LANG.CREATE,
              action: NAVIGATION_LINKS.ROLES.CREATE,
            },
          }}
        />
      </Card>
    </AppLayout>
  );
}
