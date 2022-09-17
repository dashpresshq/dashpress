import { Spacer, StyledCard, Text } from "@hadmean/chromista";
import { useEntityFilterCount } from "frontend/hooks/data/data.store";
import { ISummaryWidgetConfig } from "shared/types";
import styled from "styled-components";
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
  const { filters, entity } = config;

  // TODO svg
  const count = useEntityFilterCount(entity, filters);

  return (
    <StyledCard>
      <StyledBox>
        <WidgetHeader setting={setting} config={config} />
        <Spacer size="xs" />
        <Text size="3" weight="bold">
          {count?.isLoading
            ? "Counting..."
            : Intl.NumberFormat("en-US").format(count?.data?.count || 0)}
        </Text>
      </StyledBox>
    </StyledCard>
  );
}
