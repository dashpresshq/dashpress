import { Stack, Text, SoftButton, DeleteButton } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { ISharedWidgetConfig, ITableTab } from "shared/types";
import { IWidgetSetting } from "./types";

interface IProps {
  config: ISharedWidgetConfig;
  setting?: IWidgetSetting;
}

export function WidgetHeader({ config, setting }: IProps) {
  const { title, entity, filter } = config;

  const entityTableTabs = useEntityConfiguration<ITableTab[]>(
    "entity_table_tabs",
    filter ? config.entity : SLUG_LOADING_VALUE
  );

  const tabTitle = (entityTableTabs.data || []).find(
    ({ id }) => id === filter
  )?.title;

  const tabFilter = filter ? `?tab=${tabTitle}` : "";

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
