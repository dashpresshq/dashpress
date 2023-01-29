import { ISelectionView } from "@hadmean/chromista/dist/Layouts/types";

export interface IAppMenuItems extends ISelectionView {
  isPermissionAllowed?: boolean;
  notFinished?: true;
  order: number;
}
