import { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { IGroupActionButton } from "./types";
import { SoftButton } from "./soft";
import { DropDownMenu } from "../drop-drop-menu";

const ELLIPSIS_THRESHOLD = 1;

export function ActionButtons({
  actionButtons,
  size,
}: {
  actionButtons: IGroupActionButton[];
  size?: VariantProps<typeof buttonVariants>["size"];
}) {
  if (actionButtons.length === 0) {
    return null;
  }

  const sortedActions = actionButtons.sort((a, b) => a.order - b.order);

  const buttonsToShow = sortedActions.slice(0, ELLIPSIS_THRESHOLD);
  const ellipsisButtons = sortedActions.slice(ELLIPSIS_THRESHOLD);

  return (
    <div className="flex w-auto gap-2">
      {buttonsToShow.map((actionButton) => (
        <SoftButton key={actionButton.id} size={size} {...actionButton} />
      ))}
      {ellipsisButtons.length > 0 && (
        <DropDownMenu
          ellipsis
          ariaLabel="More Actions"
          menuItems={ellipsisButtons}
        />
      )}
    </div>
  );
}
