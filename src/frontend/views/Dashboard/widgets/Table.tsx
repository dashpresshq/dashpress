import { Spacer, StyledCard, WidgetHeader } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { EntityTableView } from "frontend/views/data/Table/TableView";
import { ITableTab } from "shared/types/data";
import { ITableWidgetConfig } from "shared/types/dashboard";
import styled from "styled-components";
import { IWidgetProps } from "./types";

const StyledBox = styled.div`
  padding: 24px;
`;

export function TableWidget({
  config,
  setting,
  link,
}: IWidgetProps<ITableWidgetConfig>) {
  const { queryId, entity } = config;

  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    config.entity
  );

  const dataState = (entityViews.data || []).find(
    ({ id }) => id === queryId
  )?.dataState;

  return (
    <StyledCard>
      <StyledBox>
        <WidgetHeader setting={setting} title={config.title} link={link} />
        <Spacer />
        <EntityTableView
          entity={entityViews.isLoading ? SLUG_LOADING_VALUE : entity}
          defaultTableState={{ ...dataState, pageSize: 5 }}
          lean
        />
      </StyledBox>
    </StyledCard>
  );
}
