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
          dataTestId: "",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Foo",
        },
        {
          title: "Dashboards",
          dataTestId: "",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Foo",
        },
        {
          title: "Schema",
          dataTestId: "",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Foo",
        },
        {
          title: "Settings",
          dataTestId: "",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
          link: "Foo",
        },
      ]}
    >
      {children}
    </DynamicLayout>
  );
};
