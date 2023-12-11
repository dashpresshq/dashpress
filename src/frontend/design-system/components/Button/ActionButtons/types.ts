import { ButtonIconTypes } from "../../Button/constants";

export type IActionButton =
  | {
      _type: "normal";
      action: string | (() => void);
      label: string;
      icon: ButtonIconTypes;
      order?: number;
    }
  | {
      _type: "delete";
      action: () => void;
      isMakingDeleteRequest: boolean;
      shouldConfirmAlert?: boolean;
      order?: number;
    };
