import { Spacer, StyledCard } from "@hadmean/chromista";
import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { EntityTableView } from "frontend/views/data/Table/TableView";
import { ITableTab, ITableWidgetConfig } from "shared/types";
import styled from "styled-components";
import { WidgetHeader } from "./Header";
import { IWidgetSetting } from "./types";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ITableWidgetConfig;
  setting?: IWidgetSetting;
}

export function TableWidget({ config, setting }: IProps) {
  const { filter, entity } = config;

  const entityTableTabs = useEntityConfiguration<ITableTab[]>(
    "entity_table_tabs",
    config.entity
  );

  const dataState = (entityTableTabs.data || []).find(
    ({ id }) => id === filter
  )?.dataState;

  return (
    <StyledCard>
      <StyledBox>
        <WidgetHeader setting={setting} config={config} />
        <Spacer />
        <EntityTableView
          entity={entityTableTabs.isLoading ? SLUG_LOADING_VALUE : entity}
          defaultTableState={{ ...dataState, pageSize: 5 }}
        />
      </StyledBox>
    </StyledCard>
  );
}
