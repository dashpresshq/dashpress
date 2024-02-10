import React from "react";
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
import { ADMIN_ROLES_CRUD_CONFIG } from "../roles/roles.store";
import {
  ADMIN_USERS_CRUD_CONFIG,
  useUserDeletionMutation,
} from "./users.store";

export function ListUsers() {
  useSetPageDetails({
    pageTitle: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ADMIN_USERS_CRUD_CONFIG.TEXT_LANG.TITLE,
    permission: USER_PERMISSIONS.CAN_MANAGE_USERS,
  });

  const roles = useApi<IRolesList[]>(ADMIN_ROLES_CRUD_CONFIG.ENDPOINTS.LIST, {
    defaultData: [],
  });

  const userDeletionMutation = useUserDeletionMutation();

  const userHasPermission = useUserHasPermission();

  const MemoizedAction = React.useCallback(
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
      label: "Link Users To Database",
      action: NAVIGATION_LINKS.USERS.LINK_DATABASE,
    });
  }

  return (
    <AppLayout actionItems={actionsItems}>
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
