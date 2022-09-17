import { Stack, Text, SoftButton, DeleteButton } from "@hadmean/chromista";
import { ISharedWidgetConfig } from "shared/types";
import { IWidgetSetting } from "./types";

interface IProps {
  config: ISharedWidgetConfig;
  setting?: IWidgetSetting;
}

export function WidgetHeader({ config, setting }: IProps) {
  const { title, link } = config;
  return (
    <Stack justify="space-between">
      <Text size="4">{title}</Text>
      <Stack width="auto">
        {setting && (
          <>
            <SoftButton action={() => setting.setId()} icon="edit" size="xs" />
            <DeleteButton
              onDelete={() => setting.delete()}
              size="xs"
              isMakingDeleteRequest={false}
              shouldConfirmAlert
            />
          </>
        )}
        {link && <SoftButton action={link.link} label={link.title} size="xs" />}
      </Stack>
    </Stack>
  );
}
