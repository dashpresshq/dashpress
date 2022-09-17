import {
  SoftButton,
  Spacer,
  StyledCard,
  Stack,
  Text,
  DeleteButton,
} from "@hadmean/chromista";
import { useEntityFilterCount } from "frontend/hooks/data/data.store";
import { IWidgetConfig } from "shared/types";
import styled from "styled-components";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: IWidgetConfig;
  setting?: {
    setId: () => void;
    delete: () => void;
  };
}

export function SummaryCard({ config: widgetConfig, setting }: IProps) {
  const { config, title, link } = widgetConfig;

  // TODO svg
  const count = useEntityFilterCount(config.entity, config.filter);

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
