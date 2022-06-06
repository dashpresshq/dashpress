import {
  Breadcrumbs,
  DynamicLayout,
  Spacer,
  Text,
} from "@gothicgeeks/design-system";
import { IValueLabel } from "@gothicgeeks/design-system/dist/types";
import React, { ReactNode } from "react";
import { HardDrive } from "react-feather";
import { useSchemaMenuItems } from "../../data-store/schema.data-store";

interface IProps {
  children: ReactNode;
  breadcrumbs: IValueLabel[];
}

export const AppLayout = ({ children, breadcrumbs }: IProps) => {
  const modelNavigation = useSchemaMenuItems();

  const homedBreadcrumb = [
    { label: "Home", value: "/" },
    ...breadcrumbs,
  ];

  return (
    <DynamicLayout
      selectionView={[
        {
          title: "Models",
          description: "Your models",
          icon: HardDrive,
          viewMenuItems: modelNavigation,
          link: "Models",
        },
        {
          title: "Dashboards",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Dashboards",
        },
        {
          title: "Schema",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Schema",
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
      <Text>{homedBreadcrumb[homedBreadcrumb.length - 1]?.label}</Text>
      <Breadcrumbs items={homedBreadcrumb} />
      <Spacer />
      {children}
    </DynamicLayout>
  );
};
