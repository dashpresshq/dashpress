import styled from "styled-components";
import { WidgetRoot } from "frontend/views/Dashboard/styles";
import { ReactElement, forwardRef } from "react";
import {
  IWidgetConfig,
  WIDGET_SCRIPT_RELATIVE_TIME_MARKER,
} from "shared/types/dashboard";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ISharedWidgetConfig } from "shared/types/dashboard/base";
import { DataStateKeys } from "frontend/lib/data/types";
import { StyledCard } from "frontend/design-system/components/Card";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { RenderCode } from "frontend/design-system/components/RenderCode";
import { Stack } from "frontend/design-system/primitives/Stack";
import { EmptyWrapper } from "frontend/design-system/components/EmptyWrapper";
import { WidgetHeader } from "../WidgetHeader";
import { IWidgetSettingProps } from "../WidgetHeader/types";
import { WIDGET_CONFIG } from "../../constants";
import { useWidgetNavigationLink } from "../../../Widget/useWidgetNavigationLink";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ISharedWidgetConfig;
  setting?: IWidgetSettingProps;
  type: IWidgetConfig["_type"];
  isPreview: boolean;
  data: DataStateKeys<unknown>;
  Component: ({
    data,
    config,
  }: {
    data: unknown;
    config: ISharedWidgetConfig;
  }) => ReactElement;
}

export const WidgetFrame = forwardRef<HTMLDivElement, IProps>(
  ({ setting, config, type, data, isPreview, Component }, ref) => {
    const navigationLink = useWidgetNavigationLink(
      config.entity,
      config.queryId
    );

    const {
      height: configHeight,
      size: configSize,
      LoadingComponent,
      requiredInterface,
      schema,
      exampleValidData,
      isDataEmpty,
    } = WIDGET_CONFIG[type];

    const height = config.height || configHeight;

    let schemaError: object | null = null;

    if (!data.isLoading || !data.error) {
      const response = schema?.safeParse(data.data);
      if (response.success === false) {
        schemaError = {
          data: data.data,
          exampleValidData,
          requiredInterface,
          ...response.error,
          name: undefined,
        };
      }
    }

    const hasRelativeDate = config.script?.includes(
      `$.${WIDGET_SCRIPT_RELATIVE_TIME_MARKER}`
    );

    return (
      <WidgetRoot
        ref={ref}
        aria-label={`${config.title} Widget`}
        $size={config.size || configSize}
        $height={height}
        hasSetting={!!setting}
      >
        <StyledCard style={{ height: "100%" }}>
          <StyledBox>
            <WidgetHeader
              setting={setting}
              title={config.title}
              widgetId={config.id}
              link={navigationLink}
              isPreview={isPreview}
              hasRelativeDate={hasRelativeDate}
            />
            <Spacer />
            <div
              style={
                schemaError
                  ? {}
                  : {
                      height: "100%",
                      overflowY: "auto",
                    }
              }
            >
              <ViewStateMachine
                error={data.error}
                loading={data.isLoading}
                loader={<LoadingComponent height={height} />}
              >
                {/* eslint-disable-next-line no-nested-ternary */}
                {schemaError ? (
                  <RenderCode input={schemaError} />
                ) : isDataEmpty(data.data) ? (
                  <Stack
                    align="center"
                    justify="center"
                    style={{ height: "100%" }}
                  >
                    <EmptyWrapper text="No Data For This Widget" />
                  </Stack>
                ) : (
                  <Component data={data.data} config={config} />
                )}
              </ViewStateMachine>
            </div>
          </StyledBox>
        </StyledCard>
      </WidgetRoot>
    );
  }
);
