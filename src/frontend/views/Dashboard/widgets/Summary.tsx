import { Spacer, Stack, StyledCard, Text } from "@hadmean/chromista";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntityFilterCount } from "frontend/hooks/data/data.store";
import { ITableTab, QueryFilter } from "shared/types/data";
import { ArrowDownLeft, ArrowUpRight, Users } from "react-feather";
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

export const SYSTEM_COLORS = {
  danger: "#f5325c",
  black: "#000",
  success: "#03d87f",
};

const IconRoot = styled.div`
  background: #e291822a;
  color: #e29182;
  width: 64px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function SummaryWidget({ config, setting }: IProps) {
  const { queryId, entity } = config;

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

  return (
    <StyledCard>
      <StyledBox>
        <Stack spacing={18}>
          <IconRoot>
            <Users />
          </IconRoot>
          <div style={{ width: "100%" }}>
            <WidgetHeader setting={setting} config={config} />
            <Spacer size="xs" />
            <Stack justify="space-between" align="end">
              <Text size="3" weight="bold">
                {count?.isLoading
                  ? "Counting..."
                  : abbreviateNumber(count?.data?.count || 0)}
              </Text>
              <Text size="6">
                <ArrowUpRight
                  size={16}
                  style={{ color: SYSTEM_COLORS.success }}
                />
                <span style={{ color: SYSTEM_COLORS.success }}>34.45%</span>
              </Text>
            </Stack>
          </div>
        </Stack>
      </StyledBox>
    </StyledCard>
  );
}
