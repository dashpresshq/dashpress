import { Stack } from "frontend/design-system/primitives/Stack";
import { SoftButton } from "../SoftButton";
import { DeleteButton } from "../DeleteButton";
import { IActionButton } from "./types";

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
  return (
    <Stack>
      {actionButtons
        .sort((a, b) => a.order - b.order)
        .map((actionButton) =>
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
    </Stack>
  );
}
