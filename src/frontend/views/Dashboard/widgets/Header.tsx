import { Stack, Text, SoftButton, DeleteButton } from "@hadmean/chromista";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { ISharedWidgetConfig } from "shared/types";
import { IWidgetSetting } from "./types";

interface IProps {
  config: ISharedWidgetConfig;
  setting?: IWidgetSetting;
}

export function WidgetHeader({ config, setting }: IProps) {
  const { title, entity, filter } = config;

  const tabFilter = filter ? `?tab=${filter}` : "";

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
        <SoftButton
          action={NAVIGATION_LINKS.ENTITY.TABLE(entity) + tabFilter}
          label="View"
          size="xs"
        />
      </Stack>
    </Stack>
  );
}
