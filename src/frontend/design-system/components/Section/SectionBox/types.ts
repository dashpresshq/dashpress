import { ButtonIconTypes } from "../../Button/constants";

export interface ISectionBoxIconButton {
  action: string | (() => void);
  label?: string;
  icon?: ButtonIconTypes;
  order?: number;
}
