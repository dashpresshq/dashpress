import type { IColorableSelection } from "@/shared/types/ui";

export const isUseColorsFlagOn = (selections: IColorableSelection[]) => {
  if (selections.length === 0) {
    return true;
  }
  return !!selections[0].spectrum;
};
