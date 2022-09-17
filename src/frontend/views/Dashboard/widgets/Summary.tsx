import {
  SoftButton,
  Spacer,
  StyledCard,
  Stack,
  Text,
  DeleteButton,
} from "@hadmean/chromista";
import { useEntityFilterCount } from "frontend/hooks/data/data.store";
import { ISummaryWidgetConfig } from "shared/types";
import styled from "styled-components";
import { IWidgetSetting } from "./types";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ISummaryWidgetConfig;
  setting?: IWidgetSetting;
}

export function SummaryWidget({ config: widgetConfig, setting }: IProps) {
  const { title, link, filter, entity } = widgetConfig;

  // TODO svg
  const count = useEntityFilterCount(entity, filter);

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
