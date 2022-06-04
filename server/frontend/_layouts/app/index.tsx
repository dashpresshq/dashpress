import { DynamicLayout } from "@gothicgeeks/design-system";
import React, { ReactNode } from "react";
import { HardDrive } from "react-feather";
import { useSchemaMenuItems } from "../../data-store/schema.data-store";

interface IProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: IProps) => {
  const modelNavigation = useSchemaMenuItems();

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
      {children}
    </DynamicLayout>
  );
};
