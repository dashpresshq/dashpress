import { ReactNode } from "react";
import { Icon } from "react-feather";
import { DataStateKeys } from "frontend/lib/data/types";
import { ButtonIconTypes } from "../components/Button/constants";

export interface IViewMenuItem {
  value: string;
  secondaryAction?: () => void;
  action: string | (() => void);
}

export interface IViewMenuItems {
  menuItems: DataStateKeys<IViewMenuItem[]>;
  getLabel: (value: string) => string;
  singular?: string;
  newItemLink?: string;
  topAction?: {
    title: string;
    action: string | (() => void);
  };
}

export interface ISelectionView {
  title: string;
  icon: Icon;
  action?: string | (() => void);
  secondaryAction?: () => void;
  view?: ReactNode;
  viewMenuItems?: IViewMenuItems;
  description?: string;
  iconButtons?: { action: () => void; icon: ButtonIconTypes }[];
}

export const FOR_CODE_COV = 1;
