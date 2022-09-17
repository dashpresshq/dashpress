import {
  SoftButton,
  Spacer,
  StyledCard,
  Stack,
  Text,
  DeleteButton,
} from "@hadmean/chromista";
import { EntityTableView } from "frontend/views/data/Table/TableView";
import { ITableWidgetConfig } from "shared/types";
import styled from "styled-components";
import { IWidgetSetting } from "./types";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ITableWidgetConfig;
  setting?: IWidgetSetting;
}

export function TableWidget({ config: widgetConfig, setting }: IProps) {
  const { title, link, filter, entity } = widgetConfig;
  // TODO pagesize, order
  return (
    <StyledCard>
      <StyledBox>
        <Stack justify="space-between">
          <Text size="4">{title}</Text>
          <Stack width="auto">
            {setting && (
              <>
                <SoftButton action={() => setting.setId()} icon="edit" />
                <DeleteButton
                  onDelete={() => setting.delete()}
                  isMakingDeleteRequest={false}
                  shouldConfirmAlert
                />
              </>
            )}
            {link && <SoftButton action={link.link} label={link.title} />}
          </Stack>
        </Stack>
        <Spacer />
        <EntityTableView
          entity={entity}
          defaultTableState={{ filters: filter }}
        />
      </StyledBox>
    </StyledCard>
  );
}
