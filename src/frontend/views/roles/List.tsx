import { useCallback } from "react";
import { AppLayout } from "frontend/_layouts/app";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SystemRoles } from "shared/types/user";
import { UserPermissions } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import {
  FEPaginationTable,
  IFETableCell,
  IFETableColumn,
} from "@/components/app/pagination-table";
import { ROLES_ENDPOINT_CONFIG, useRoleDeletionMutation } from "./roles.store";
import { Card } from "@/components/ui/card";
import { ActionButtons } from "@/components/app/button/action";

export function ListRoles() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.ROLES);
  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: `list-roles`,
    permission: UserPermissions.CAN_MANAGE_PERMISSIONS,
  });

  const roleDeletionMutation = useRoleDeletionMutation();

  const MemoizedAction = useCallback(
    ({ row }: IFETableCell<IRolesList>) => {
      const roleId = row.original.value;
      if ((Object.values(SystemRoles) as string[]).includes(roleId)) {
        return null;
      }
      return (
        <ActionButtons
          size="icon"
          actionButtons={[
            {
              id: "edit",
              action: NAVIGATION_LINKS.ROLES.DETAILS(roleId),
              label: domainMessages.TEXT_LANG.EDIT,
              systemIcon: "Edit",
            },
            {
              ...DELETE_BUTTON_PROPS({
                action: () => roleDeletionMutation.mutateAsync(roleId),
                label: domainMessages.TEXT_LANG.DELETE,
                isMakingRequest: false,
              }),
            },
          ]}
        />
      );
    },
    [roleDeletionMutation.isPending]
  );
  const columns: IFETableColumn<IRolesList>[] = [
    {
      Header: msg`Role`,
      accessor: "label",
      filter: {
        _type: "string",
        bag: undefined,
      },
    },
    {
      Header: msg`Action`,
      disableSortBy: true,
      accessor: "__action__",
      Cell: MemoizedAction,
    },
  ];
  // TODO transform super admin and viewer
  return (
    <AppLayout
      actionItems={[
        {
          id: "add",
          label: domainMessages.TEXT_LANG.CREATE,
          systemIcon: "Plus",
          action: NAVIGATION_LINKS.ROLES.CREATE,
        },
      ]}
    >
      <Card>
        <FEPaginationTable
          dataEndpoint={ROLES_ENDPOINT_CONFIG.LIST}
          columns={columns}
          empty={{
            text: domainMessages.TEXT_LANG.EMPTY_LIST,
            createNew: {
              label: domainMessages.TEXT_LANG.CREATE,
              action: NAVIGATION_LINKS.ROLES.CREATE,
            },
          }}
        />
      </Card>
    </AppLayout>
  );
}
