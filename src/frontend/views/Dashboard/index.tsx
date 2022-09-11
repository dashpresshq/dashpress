import {
  ComponentIsLoading,
  SoftButton,
  Spacer,
  StyledCard,
  Stack,
  Text,
} from "@hadmean/chromista";
import styled from "styled-components";
import { Row, Col } from "styled-bootstrap-grid";
import { useRouter } from "next/router";
import { Settings } from "react-feather";
import { useEntitiesCount } from "frontend/hooks/data/data.store";
import { useSetPageDetails } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/types";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import { AppLayout } from "../../_layouts/app";
import { NAVIGATION_LINKS } from "../../lib/routing/links";

const StyledBox = styled.div`
  padding: 24px;
`;

export function Dashboard() {
  const entitiesMenuItems = useEntitiesMenuItems();
  const entitiesCount = useEntitiesCount(
    (entitiesMenuItems?.data || []).map(({ value }) => value)
  );
  const router = useRouter();

  useSetPageDetails({
    pageTitle: "Home",
    viewKey: "HOME",
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  return (
    <AppLayout
      actionItems={[
        {
          label: "Manage Entities",
          IconComponent: Settings,
          onClick: () => {
            router.push(NAVIGATION_LINKS.SETTINGS.ENTITIES);
          },
        },
      ]}
    >
      <ViewStateMachine
        loading={entitiesMenuItems.isLoading}
        error={entitiesMenuItems.error}
        loader={<ComponentIsLoading />}
      >
        <Row>
          {entitiesMenuItems.data.map((field) => (
            <Col lg={4} md={6} sm={12} key={field.value}>
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
                      : Intl.NumberFormat("en-US").format(
                          entitiesCount.data[field.value]?.data?.count || 0
                        )}
                  </Text>
                </StyledBox>
              </StyledCard>
              <Spacer size="xl" />
            </Col>
          ))}
        </Row>
      </ViewStateMachine>
    </AppLayout>
  );
}
