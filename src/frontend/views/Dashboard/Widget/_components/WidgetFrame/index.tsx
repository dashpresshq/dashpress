import styled from "styled-components";
import {
  Spacer,
  StyledCard,
  EmptyWrapper,
  Stack,
  RenderCode,
} from "@hadmean/chromista";
import { WidgetRoot } from "frontend/views/Dashboard/styles";
import { ReactElement, forwardRef } from "react";
import { ISharedWidgetConfig } from "shared/types/dashboard/base";
import { IWidgetConfig } from "shared/types/dashboard";
import { DataStateKeys } from "@hadmean/protozoa";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useWidgetNavigationLink } from "../../../Widget/useWidgetNavigationLink";
import { WIDGET_CONFIG } from "../../constants";
import { IWidgetSettingProps } from "../WidgetHeader/types";
import { WidgetHeader } from "../WidgetHeader";

const StyledBox = styled.div`
  padding: 24px;
`;

interface IProps {
  config: ISharedWidgetConfig;
  setting?: IWidgetSettingProps;
  type: IWidgetConfig["_type"];
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
  ({ setting, config, type, data, Component }, ref) => {
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

    const styleHeight = height ? `${height}px` : undefined;

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

    return (
      <WidgetRoot
        ref={ref}
        aria-label={`${config.title} Widget`}
        size={config.size || configSize}
        hasSetting={!!setting}
      >
        <StyledCard>
          <StyledBox>
            <WidgetHeader
              setting={setting}
              title={config.title}
              widgetId={config.id}
              link={navigationLink}
            />
            <Spacer />
            <div
              style={
                schemaError
                  ? {}
                  : {
                      height: styleHeight,
                      overflowY: "auto",
                    }
              }
            >
              <ViewStateMachine
                error={data.error}
                loading={data.isLoading}
                loader={<LoadingComponent height={styleHeight} />}
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
