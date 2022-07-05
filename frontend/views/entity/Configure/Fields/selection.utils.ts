import { IColorableSelection } from './types';

export const isUseColorsFlagOn = (selections: IColorableSelection[]) => {
  if (selections.length === 0) {
    return true;
  }
  return !!selections[0].color;
};

export const SYSTEM_COLORS = ['#f0f', '#0f0', '#ff0', '#00f'];
