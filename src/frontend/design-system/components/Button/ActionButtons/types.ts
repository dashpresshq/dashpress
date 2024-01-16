import { SystemIconsKeys } from "shared/constants/Icons";

export type IActionButton =
  | {
      _type: "normal";
      action: string | (() => void);
      label: string;
      isMakingActionRequest?: boolean;
      systemIcon: SystemIconsKeys;
      order?: number;
    }
  | {
      _type: "delete";
      action: () => void;
      isMakingDeleteRequest: boolean;
      shouldConfirmAlert?: boolean;
      order?: number;
    };
