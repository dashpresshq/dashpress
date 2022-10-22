import { Stack, Text, SoftButton, DeleteButton } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { ITableTab } from "shared/types/data";
import { ISharedWidgetConfig } from "shared/types/dashboard";
import { IWidgetSetting } from "./types";

interface IProps {
  config: ISharedWidgetConfig;
  setting?: IWidgetSetting;
}

export function WidgetHeader({ config, setting }: IProps) {
  const { title, entity, queryId } = config;

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    queryId ? config.entity : SLUG_LOADING_VALUE
  );

  const tabTitle = (entityViews.data || []).find(
    ({ id }) => id === queryId
  )?.title;

  const tabFilter = queryId ? `?tab=${tabTitle}` : "";

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
