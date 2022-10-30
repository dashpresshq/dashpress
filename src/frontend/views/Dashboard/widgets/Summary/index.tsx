import {
  FilterOperators,
  SummaryWidget as SummaryWidgetPresentation,
} from "@hadmean/chromista";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntityFilterCount } from "frontend/hooks/data/data.store";
import { ITableTab, QueryFilter } from "shared/types/data";
import { ISummaryWidgetConfig } from "shared/types/dashboard";
import { DATE_FILTER_VALUE } from "@hadmean/protozoa";
import { ROYGBIV } from "shared/constants/colors";
import { IWidgetProps } from "../types";
import { getFullAndRelativeCount } from "./getFullAndRelativeCount";

export function SummaryWidget({
  config,
  setting,
  link,
}: IWidgetProps<ISummaryWidgetConfig>) {
  const { queryId, entity, color, dateField, icon } = config;

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    config.entity
  );

  const filters: QueryFilter[] =
    ((entityViews.data || []).find(({ id }) => id === queryId)?.dataState
      ?.filters as QueryFilter[]) || [];

  const count = useEntityFilterCount(
    entity,
    entityViews.isLoading ? "loading" : filters
  );

  const relativeCount = useEntityFilterCount(
    entity,
    entityViews.isLoading || !dateField
      ? "loading"
      : [
          ...filters,
          {
            id: dateField,
            value: {
              operator: FilterOperators.DATE,
              value: DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE,
              value2: `5:${DATE_FILTER_VALUE.MONTH}`,
              // value2: DATE_FILTER_VALUE.BEGINNING_OF_TIME_VALUE,
              // value2: `:${DATE_FILTER_VALUE.MONTH}`,
            },
          },
        ]
  );

  const [fullCount$1, relativeCount$1, direction] = getFullAndRelativeCount(
    count.isLoading ? "loading" : count?.data?.count || 0,
    relativeCount.isLoading ? "loading" : relativeCount?.data?.count || 0,
    !!dateField
  );

  return (
    <SummaryWidgetPresentation
      color={ROYGBIV[color]}
      setting={setting}
      link={link}
      title={config.title}
      icon={icon}
      fullCount={fullCount$1}
      relativeCount={relativeCount$1}
      direction={direction}
    />
  );
}
