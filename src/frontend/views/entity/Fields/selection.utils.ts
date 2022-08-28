import { IColorableSelection } from "shared/types";

export const isUseColorsFlagOn = (selections: IColorableSelection[]) => {
  if (selections.length === 0) {
    return true;
  }
  return !!selections[0].color;
};

export const SYSTEM_COLORS = ["#0f0", "#f0f", "#ff0", "#00f"];
