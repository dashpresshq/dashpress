import {
  FilterOperators,
  Spacer,
  Stack,
  StyledCard,
  Text,
} from "@hadmean/chromista";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntityFilterCount } from "frontend/hooks/data/data.store";
import { ITableTab, QueryFilter } from "shared/types/data";
import { ArrowDownLeft, ArrowUpRight, Users } from "react-feather";
import { ISummaryWidgetConfig } from "shared/types/dashboard";
import styled from "styled-components";
import { abbreviateNumber } from "frontend/lib/numbers";
import { ROYGBIV } from "shared/constants/colors";
import { DATE_FILTER_VALUE } from "@hadmean/protozoa";
import { WidgetHeader } from "./Header";
import { IWidgetSetting } from "./types";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ISummaryWidgetConfig;
  setting?: IWidgetSetting;
}

export const SYSTEM_COLORS = {
  danger: "#f5325c",
  black: "#000",
  success: "#00a05a",
};

const IconRoot = styled.div<{ color: string }>`
  background: ${(props) => props.color}2a;
  color: ${(props) => props.color};
  width: 64px;
  border: 1px solid ${(props) => props.color};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function SummaryWidget({ config, setting }: IProps) {
  const { queryId, entity, color, dateField } = config;

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
              value2: `:${DATE_FILTER_VALUE.MONTH}`,
            },
          },
        ]
  );

  const fullCount = count?.data?.count || 0;
  const fullRelativeCount = relativeCount?.data?.count || 0;

  const difference = dateField ? fullCount - fullRelativeCount : 0;

  const isPositive = difference >= 0;

  const directionColor = isPositive
    ? SYSTEM_COLORS.success
    : SYSTEM_COLORS.danger;

  const percentage =
    fullRelativeCount > 0
      ? ((fullCount - fullRelativeCount) / fullRelativeCount) * 100
      : 0;

  return (
    <StyledCard>
      <StyledBox>
        <Stack spacing={18}>
          <IconRoot color={ROYGBIV[color]}>
            <Users />
          </IconRoot>
          <div style={{ width: "100%" }}>
            <WidgetHeader setting={setting} config={config} />
            <Spacer size="xs" />
            <Stack justify="space-between" align="end">
              <Text size="3" weight="bold">
                {count?.isLoading ? "Counting..." : abbreviateNumber(fullCount)}
              </Text>
              {dateField ? (
                <Text size="6">
                  {isPositive ? (
                    <ArrowUpRight size={16} style={{ color: directionColor }} />
                  ) : (
                    <ArrowDownLeft
                      size={16}
                      style={{ color: directionColor }}
                    />
                  )}
                  <span style={{ color: directionColor }}>
                    {percentage.toFixed(2)}%
                  </span>
                </Text>
              ) : null}
            </Stack>
          </div>
        </Stack>
      </StyledBox>
    </StyledCard>
  );
}
