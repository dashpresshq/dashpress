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
import { HardDrive, Plus, Save } from "react-feather";
import { useEntitiesMenuItems } from "../../data-store/entities.data-store";

interface IProps {
  children: ReactNode;
  breadcrumbs: IValueLabel[];
}

export const AppLayout = ({ children, breadcrumbs }: IProps) => {
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
        <DropDownMenu
          menuItems={[
            {
              label: "Foo",
              // description: "Foo",
              IconComponent: Save,
              onClick: () => console.log("Do nothing"),
            },
            {
              label: "Bar",
              // description: "Bar",
              IconComponent: Plus,
              onClick: () => console.log("Do nothing"),
            },
          ]}
        />
      </Stack>
      <Spacer />
      {children}
    </DynamicLayout>
  );
};
