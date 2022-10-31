import { ROYGBIV } from "shared/constants/colors";
import { IColorableSelection } from "shared/types/ui";

export const isUseColorsFlagOn = (selections: IColorableSelection[]) => {
  if (selections.length === 0) {
    return true;
  }
  return !!selections[0].color;
};

export const SYSTEM_COLORS = [
  ROYGBIV.green,
  ROYGBIV.red,
  ROYGBIV.orange,
  ROYGBIV.yellow,
  ROYGBIV.indigo,
  ROYGBIV.violet,
];
