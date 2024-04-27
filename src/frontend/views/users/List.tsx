import { AppLayout } from "frontend/_layouts/app";
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
import { Card } from "frontend/design-system/components/Card";
import { ActionButtons } from "frontend/design-system/components/Button/ActionButtons";
import { DELETE_BUTTON_PROPS } from "frontend/design-system/components/Button/constants";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { IDropDownMenuItem } from "frontend/design-system/components/DropdownMenu";
import { useCallback } from "react";
import { msg } from "@lingui/macro";
import { ROLES_ENDPOINT_CONFIG } from "../roles/roles.store";
import {
  ADMIN_USERS_CRUD_CONFIG,
  USERS_ENDPOINT_CONFIG,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: `users`,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
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
          justIcons
          actionButtons={[
            {
              id: "edit",
              action: NAVIGATION_LINKS.USERS.DETAILS(username),
              label: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.EDIT,
              systemIcon: "Edit",
            },
            {
              ...DELETE_BUTTON_PROPS({
                action: () => userDeletionMutation.mutateAsync(username),
                label: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.DELETE,
                isMakingRequest: false,
              }),
            },
          ]}
        />
      );
    },
    [userDeletionMutation.isPending]
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
        bag: roles.data,
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

  const actionsItems: IDropDownMenuItem[] = [
    {
      id: "add",
      systemIcon: "UserPlus",
      label: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.CREATE,
      action: NAVIGATION_LINKS.USERS.CREATE,
    },
  ];

  if (userHasPermission(USER_PERMISSIONS.CAN_CONFIGURE_APP)) {
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
