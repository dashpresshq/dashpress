import { Spacer, StyledCard } from "@hadmean/chromista";
import { EntityTableView } from "frontend/views/data/Table/TableView";
import { ITableWidgetConfig } from "shared/types";
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
  const { filters, entity } = config;
  // TODO pagesize, order
  return (
    <StyledCard>
      <StyledBox>
        <WidgetHeader setting={setting} config={config} />
        <Spacer />
        <EntityTableView entity={entity} defaultTableState={{ filters }} />
      </StyledBox>
    </StyledCard>
  );
}
