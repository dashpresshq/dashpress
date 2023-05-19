import React from "react";
import {
  DeleteButton,
  DropDownMenu,
  SoftButton,
  Stack,
  Typo,
} from "@hadmean/chromista";
import { useDashboardWidgetRelativeDateStore } from "../../../relativeTime.store";
import { IWidgetSettingProps } from "./types";
import { DASHBOARD_RELATIVE_DAYS } from "./constants";

interface IProps {
  setting?: IWidgetSettingProps;
  title: string;
  widgetId: string;
  link?: string;
}

export function WidgetHeader({ title, setting, link, widgetId }: IProps) {
  const { setWidgetRelativeDate } = useDashboardWidgetRelativeDateStore();

  return (
    <Stack justify="space-between" align="flex-start">
      <Typo.MD ellipsis>{title}</Typo.MD>
      <Stack width="auto">
        {setting && (
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
        )}
        <DropDownMenu
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
          disabled={!!setting}
        />
        {link ? (
          <SoftButton action={link} label="View" icon="right" justIcon />
        ) : null}
      </Stack>
    </Stack>
  );
}
