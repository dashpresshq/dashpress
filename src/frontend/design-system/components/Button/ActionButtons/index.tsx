import { Stack } from "frontend/design-system/primitives/Stack";
import { SoftButton } from "../SoftButton";
import { DeleteButton } from "../DeleteButton";
import { IActionButton } from "./types";
import { DropDownMenu } from "../../DropdownMenu";

const ELLIPSIS_THRESHOLD = 3;

export function ActionButtons({
  actionButtons,
  justIcons,
}: {
  actionButtons: IActionButton[];
  justIcons?: true;
}) {
  if (actionButtons.length === 0) {
    return null;
  }

  const sortedActions = actionButtons.sort((a, b) => a.order - b.order);

  const buttonsToShow = sortedActions.slice(0, ELLIPSIS_THRESHOLD);
  const ellipsisButtons = sortedActions.slice(ELLIPSIS_THRESHOLD);

  return (
    <Stack>
      {buttonsToShow.map((actionButton) =>
        actionButton._type === "normal" ? (
          <SoftButton
            key={actionButton.icon}
            action={actionButton.action}
            label={actionButton.label}
            justIcon={justIcons}
            isMakingActionRequest={actionButton.isMakingActionRequest}
            icon={actionButton.icon}
          />
        ) : (
          <DeleteButton
            key={actionButton._type}
            onDelete={actionButton.action}
            shouldConfirmAlert={actionButton.shouldConfirmAlert}
            isMakingDeleteRequest={actionButton.isMakingDeleteRequest}
          />
        )
      )}
      {ellipsisButtons.length > 0 && (
        <DropDownMenu
          ellipsis
          ariaLabel="More Actions"
          menuItems={ellipsisButtons.map((button) => ({
            id: button._type === "delete" ? "Delete" : button.label,
            label: button._type === "delete" ? "Delete" : button.label,
            onClick: typeof button.action === "function" && button.action,
          }))}
        />
      )}
    </Stack>
  );
}
