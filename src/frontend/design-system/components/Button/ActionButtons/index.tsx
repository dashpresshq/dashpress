import { Stack } from "frontend/design-system/primitives/Stack";
import { SoftButton } from "../SoftButton";
import { DropDownMenu } from "../../DropdownMenu";
import { IGroupActionButton } from "../types";

const ELLIPSIS_THRESHOLD = 3;

export function ActionButtons({
  actionButtons,
  justIcons,
  size,
}: {
  actionButtons: IGroupActionButton[];
  justIcons?: true;
  size?: "sm" | "xs";
}) {
  if (actionButtons.length === 0) {
    return null;
  }

  const sortedActions = actionButtons.sort((a, b) => a.order - b.order);

  const buttonsToShow = sortedActions.slice(0, ELLIPSIS_THRESHOLD);
  const ellipsisButtons = sortedActions.slice(ELLIPSIS_THRESHOLD);

  return (
    <Stack $width="auto">
      {buttonsToShow.map((actionButton) => (
        <SoftButton
          key={actionButton.id}
          justIcon={justIcons}
          size={size}
          {...actionButton}
        />
      ))}
      {ellipsisButtons.length > 0 && (
        <DropDownMenu
          ellipsis
          ariaLabel="More Actions"
          menuItems={ellipsisButtons}
        />
      )}
    </Stack>
  );
}
