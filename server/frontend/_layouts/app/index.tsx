import {
  Breadcrumbs,
  DropDownMenu,
  DynamicLayout,
  Spacer,
  Stack,
  Text,
} from "@gothicgeeks/design-system";
import { IValueLabel } from "@gothicgeeks/design-system/dist/types";
import React, { ReactNode } from "react";
import { HardDrive, Icon } from "react-feather";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";

interface IProps {
  children: ReactNode;
  breadcrumbs: IValueLabel[];
  actionItems?: {
    label: string;
    onClick: () => void;
    IconComponent: Icon;
  }[];
}

export const AppLayout = ({
  children,
  breadcrumbs,
  actionItems = [],
}: IProps) => {
  const entitiesMenuItems = useEntitiesMenuItems();

  const homedBreadcrumb = [{ label: "Home", value: "/" }, ...breadcrumbs];

  return (
    <DynamicLayout
      selectionView={[
        {
          title: "Tables",
          description: "Your models",
          icon: HardDrive,
          viewMenuItems: entitiesMenuItems,
          link: "Tables",
        },
        {
          title: "Dashboards",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Dashboards",
        },
        {
          title: "Entities",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Entities",
        },
        {
          title: "Settings",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Settings",
        },
      ]}
    >
      <Stack justify="space-between" align="center">
        <div>
          <Text>{homedBreadcrumb[homedBreadcrumb.length - 1]?.label}</Text>
          <Breadcrumbs items={homedBreadcrumb} />
        </div>
        {/* Remove this logic on version update */}
        {actionItems.length > 0 && <DropDownMenu menuItems={actionItems} />}
      </Stack>
      <Spacer />
      {children}
    </DynamicLayout>
  );
};
