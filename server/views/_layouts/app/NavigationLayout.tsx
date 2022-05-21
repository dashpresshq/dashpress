import { ReactNode } from "react";
import { INavigationItem } from "../types";
import { BaseLayout } from "./_BaseLayout";

interface IProps {
  children: ReactNode;
  navigationItems: INavigationItem[];
}

export const NavigationLayout: React.FC<IProps> = ({
  children,
  navigationItems,
}) => {
  return <BaseLayout navigationItems={navigationItems}>{children}</BaseLayout>;
};
