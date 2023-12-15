import React from "react";
import { DeleteButton } from "frontend/design-system/components/Button/DeleteButton";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Typo } from "frontend/design-system/primitives/Typo";
import { DropDownMenu } from "frontend/design-system/components/DropdownMenu";
import { DASHBOARD_RELATIVE_DAYS } from "./constants";
import { IWidgetSettingProps } from "./types";
import { useDashboardWidgetRelativeDateStore } from "../../../relativeTime.store";

interface IProps {
  setting?: IWidgetSettingProps;
  title: string;
  widgetId: string;
  link?: string;
  isPreview?: boolean;
  hasRelativeDate: boolean;
}

export function WidgetHeader({
  title,
  setting,
  link,
  widgetId,
  isPreview,
  hasRelativeDate,
}: IProps) {
  const [setWidgetRelativeDate] = useDashboardWidgetRelativeDateStore(
    (store) => [store.setWidgetRelativeDate]
  );

  return (
    <Stack justify="space-between" align="flex-start">
      <Typo.MD ellipsis>{title}</Typo.MD>
      <Stack width="auto">
        {setting ? (
          <>
            <SoftButton
              action={() => setting.setId()}
              icon="edit"
              label="Edit Widget"
              justIcon
            />
            <DeleteButton
              onDelete={() => setting.delete()}
              isMakingDeleteRequest={false}
              shouldConfirmAlert
            />
          </>
        ) : (
          <>
            {hasRelativeDate && !isPreview && (
              <DropDownMenu
                ariaLabel={`Toggle ${title} Menu`}
                menuItems={DASHBOARD_RELATIVE_DAYS.map(({ label, value }) => ({
                  id: label,
                  label: `${label}`,
                  onClick: () => {
                    setWidgetRelativeDate({
                      widgetId,
                      currentRelativeDay: value,
                    });
                  },
                }))}
              />
            )}
            {link && (
              <SoftButton
                action={link}
                label="View"
                icon="right"
                disabled={isPreview}
                justIcon
              />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
