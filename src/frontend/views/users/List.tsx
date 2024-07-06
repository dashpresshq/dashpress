import { msg } from "@lingui/macro";
import { AppLayout } from "frontend/_layouts/app";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useApi } from "frontend/lib/data/useApi";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { useCallback } from "react";
import { roleLabel, UserPermissions } from "shared/constants/user";
import type { IRolesList } from "shared/types/roles";
import type { IAccountProfile } from "shared/types/user";
import { transformLabelValueToSelectData } from "translations/fake";

import { ActionButtons } from "@/components/app/button/action";
import { DELETE_BUTTON_PROPS } from "@/components/app/button/constants";
import type { IMenuActionItem } from "@/components/app/button/types";
import type {
  IFETableCell,
  IFETableColumn,
} from "@/components/app/pagination-table";
import { FEPaginationTable } from "@/components/app/pagination-table";
import { Card } from "@/components/ui/card";

import { ROLES_ENDPOINT_CONFIG } from "../roles/roles.store";
import { USERS_ENDPOINT_CONFIG, useUserDeletionMutation } from "./users.store";

export function ListUsers() {
  const domainMessages = useDomainMessages(LANG_DOMAINS.ACCOUNT.USERS);

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: `users`,
    permission: UserPermissions.CAN_MANAGE_USERS,
  });

  const roles = useApi<IRolesList[]>(ROLES_ENDPOINT_CONFIG.LIST, {
    defaultData: [],
  });

  const userDeletionMutation = useUserDeletionMutation();

  const userHasPermission = useUserHasPermission();

  const MemoizedAction = useCallback(
    ({ row }: IFETableCell<IAccountProfile>) => {
      const { username } = row.original;
      return (
        <ActionButtons
          size="icon"
          actionButtons={[
            {
              id: "edit",
              action: NAVIGATION_LINKS.USERS.DETAILS(username),
              label: domainMessages.TEXT_LANG.EDIT,
              systemIcon: "Edit",
            },
            {
              ...DELETE_BUTTON_PROPS({
                action: () => userDeletionMutation.mutateAsync(username),
                label: domainMessages.TEXT_LANG.DELETE,
                isMakingRequest: false,
              }),
            },
          ]}
        />
      );
    },
    [
      domainMessages.TEXT_LANG.DELETE,
      domainMessages.TEXT_LANG.EDIT,
      userDeletionMutation,
    ]
  );

  const columns: IFETableColumn<IAccountProfile>[] = [
    {
      Header: msg`Username`,
      accessor: "username",
      filter: {
        _type: "string",
        bag: undefined,
      },
    },
    {
      Header: msg`Name`,
      accessor: "name",
      filter: {
        _type: "string",
        bag: undefined,
      },
    },
    {
      Header: msg`Role`,
      accessor: "role",
      filter: {
        _type: "status",
        bag: transformLabelValueToSelectData(roles.data),
      },
      Cell: ({ value }) => roleLabel(value as string),
    },
    {
      Header: msg`Action`,
      disableSortBy: true,
      accessor: "__action__",
      Cell: MemoizedAction,
    },
  ];

  const actionsItems: IMenuActionItem[] = [
    {
      id: "add",
      systemIcon: "UserPlus",
      label: domainMessages.TEXT_LANG.CREATE,
      action: NAVIGATION_LINKS.USERS.CREATE,
    },
  ];

  if (userHasPermission(UserPermissions.CAN_CONFIGURE_APP)) {
    actionsItems.push({
      id: "connect",
      systemIcon: "Link",
      label: msg`Link Users To Database`,
      action: NAVIGATION_LINKS.USERS.LINK_DATABASE,
    });
  }

  return (
    <AppLayout actionItems={actionsItems}>
      <Card>
        <FEPaginationTable
          dataEndpoint={USERS_ENDPOINT_CONFIG.LIST}
          columns={columns}
          empty={{
            text: domainMessages.TEXT_LANG.EMPTY_LIST,
            createNew: {
              label: domainMessages.TEXT_LANG.CREATE,
              action: NAVIGATION_LINKS.USERS.CREATE,
            },
          }}
        />
      </Card>
    </AppLayout>
  );
}
