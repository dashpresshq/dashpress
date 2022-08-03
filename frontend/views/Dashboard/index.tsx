import {
  ComponentIsLoading,
  ErrorAlert,
  SoftButton,
  Spacer,
  Stack,
  Text,
} from "@gothicgeeks/design-system";
import styled from "styled-components";
import * as StyledGrid from "styled-bootstrap-grid";
import { useRouter } from "next/router";
import { HardDrive } from "react-feather";
import { useEntitiesCount } from "frontend/hooks/data/data.store";
import { useSetPageTitle } from "frontend/lib/routing/useGoBackContext";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import { AppLayout } from "../../_layouts/app";
import { NAVIGATION_LINKS } from "../../lib/routing/links";

const StyledBox = styled.div`
  padding: 24px;
`;

const StyledCard = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.border};
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 1px 1px rgb(0 0 0 / 10%);
  border-radius: 0.25rem;
`;

export function Dashboard() {
  const entitiesMenuItems = useEntitiesMenuItems();
  const entitiesCount = useEntitiesCount(
    (entitiesMenuItems?.data || []).map(({ value }) => value)
  );
  const router = useRouter();

  useSetPageTitle("Home");

  return (
    <AppLayout
      actionItems={[
        {
          label: "Manage Entities",
          IconComponent: HardDrive,
          onClick: () => {
            router.push(NAVIGATION_LINKS.SETTINGS.ENTITIES);
          },
        },
      ]}
    >
      {entitiesMenuItems.isLoading && <ComponentIsLoading />}
      {entitiesMenuItems.error && (
        <ErrorAlert message={entitiesMenuItems.error} />
      )}
      {!entitiesMenuItems.isLoading && !entitiesMenuItems.error && (
        <StyledGrid.Row>
          {entitiesMenuItems.data.map((field) => (
            <StyledGrid.Col lg={4} md={6} sm={12} key={field.value}>
              <StyledCard>
                <StyledBox>
                  <Stack justify="space-between">
                    <Text size="4">{field.label}</Text>
                    <SoftButton
                      action={NAVIGATION_LINKS.ENTITY.TABLE(field.value)}
                      label="View Data"
                      icon="eye"
                    />
                  </Stack>
                  <Spacer size="xs" />
                  <Text size="3" weight="bold">
                    {entitiesCount.data[field.value]?.isLoading
                      ? "Counting..."
                      : entitiesCount.data[field.value]?.data?.count}
                  </Text>
                </StyledBox>
              </StyledCard>
              <Spacer size="xl" />
            </StyledGrid.Col>
          ))}
        </StyledGrid.Row>
      )}
    </AppLayout>
  );
}
