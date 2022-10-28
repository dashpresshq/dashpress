import { Spacer, StyledCard, Text } from "@hadmean/chromista";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntityFilterCount } from "frontend/hooks/data/data.store";
import { ITableTab, QueryFilter } from "shared/types/data";
import { ISummaryWidgetConfig } from "shared/types/dashboard";
import styled from "styled-components";
import { abbreviateNumber } from "frontend/lib/numbers";
import { WidgetHeader } from "./Header";
import { IWidgetSetting } from "./types";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ISummaryWidgetConfig;
  setting?: IWidgetSetting;
}

export function SummaryWidget({ config, setting }: IProps) {
  const { queryId, entity } = config;

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    config.entity
  );

  const filters: QueryFilter[] =
    ((entityViews.data || []).find(({ id }) => id === queryId)?.dataState
      ?.filters as QueryFilter[]) || [];

  // TODO statusIndicator
  const count = useEntityFilterCount(
    entity,
    entityViews.isLoading ? "loading" : filters
  );

  return (
    <StyledCard>
      <StyledBox>
        <WidgetHeader setting={setting} config={config} />
        <Spacer size="xs" />
        <Text size="3" weight="bold">
          {count?.isLoading
            ? "Counting..."
            : abbreviateNumber(count?.data?.count || 0)}
        </Text>
      </StyledBox>
    </StyledCard>
  );
}
