import { ISelectionView } from "frontend/design-system/layouts/types";

export interface IAppMenuItems extends ISelectionView {
  isPermissionAllowed?: boolean;
  order: number;
}
