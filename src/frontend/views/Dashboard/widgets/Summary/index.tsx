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
import { ArrowDownLeft, ArrowUpRight, Icon } from "react-feather";
import { ISummaryWidgetConfig } from "shared/types/dashboard";
import styled from "styled-components";
import { ROYGBIV } from "shared/constants/colors";
import { DATE_FILTER_VALUE } from "@hadmean/protozoa";
import { WidgetHeader } from "../Header";
import { IWidgetSetting } from "../types";
import { getFullAndRelativeCount } from "./getFullAndRelativeCount";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ISummaryWidgetConfig;
  setting?: IWidgetSetting;
}

export const SYSTEM_COLORS = {
  danger: "#f5325c",
  black: "var(--hadmean-main-text)",
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

interface IPresensentationProps extends IProps {
  color: string;
  fullCount: string;
  relativeCount: string;
  icon: string;
  direction: "up" | "down" | "side";
}

const DirectionImplementation: Record<
  "up" | "down" | "side",
  {
    color: string;
    Icon: Icon;
  }
> = {
  down: {
    Icon: ArrowDownLeft,
    color: SYSTEM_COLORS.danger,
  },
  up: {
    Icon: ArrowUpRight,
    color: SYSTEM_COLORS.success,
  },
  side: {
    Icon: () => null,
    color: SYSTEM_COLORS.black,
  },
};

function Presentation({
  color,
  fullCount,
  relativeCount,
  config,
  direction,
  setting,
  icon,
}: IPresensentationProps) {
  const { Icon: DirectionIcon, color: directionColor } =
    DirectionImplementation[direction];

  return (
    <StyledCard>
      <StyledBox>
        <Stack spacing={18}>
          <IconRoot
            color={ROYGBIV[color]}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
          <div style={{ width: "100%" }}>
            <WidgetHeader setting={setting} config={config} />
            <Spacer size="xs" />
            <Stack justify="space-between" align="end">
              <Text size="3" weight="bold">
                {fullCount}
              </Text>
              {relativeCount ? (
                <Text size="6">
                  <DirectionIcon size={20} style={{ color: directionColor }} />
                  <span style={{ color: directionColor }}>{relativeCount}</span>
                </Text>
              ) : null}
            </Stack>
          </div>
        </Stack>
      </StyledBox>
    </StyledCard>
  );
}

export function SummaryWidget({ config, setting }: IProps) {
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
    <Presentation
      color={color}
      setting={setting}
      config={config}
      icon={icon}
      fullCount={fullCount$1}
      relativeCount={relativeCount$1}
      direction={direction}
    />
  );
}
