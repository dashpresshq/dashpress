import React from "react";
import { DeleteButton, SoftButton, Stack, Typo } from "@hadmean/chromista";
import { IWidgetSettingProps } from "./types";

interface IProps {
  setting?: IWidgetSettingProps;
  title: string;
  link?: string;
}

export function WidgetHeader({ title, setting, link }: IProps) {
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
        {link ? (
          <SoftButton action={link} label="View" icon="right" justIcon />
        ) : null}
      </Stack>
    </Stack>
  );
}
