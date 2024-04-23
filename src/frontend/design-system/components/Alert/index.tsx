import { useEffect } from "react";
import styled from "styled-components";
import {
  AlertTriangle,
  ThumbsUp,
  Icon,
  Info as InfoIcon,
  X,
} from "react-feather";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Typo } from "frontend/design-system/primitives/Typo";
import { getBestErrorMessage } from "frontend/lib/toast/utils";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { SoftButtonStyled } from "../Button/Button";

export enum AlertType {
  Success = "success",
  Error = "danger",
  Warning = "warning",
  Info = "info",
}

interface IAlert {
  message: Record<string, unknown> | string | unknown;
  action?: {
    label: string;
    action: () => void;
    Icon: Icon;
  };
  renderJsx?: boolean;
}

export type IProps = {
  type: AlertType;
} & IAlert;

const Root = styled.div<{
  type: AlertType;
  $color: string;
}>`
  display: flex;
  justify: space-between;
  align-items: stretch;
  border: 0;
  width: 100%;
  margin-bottom: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  color: ${(props) => props.$color};
  background-color: ${(props) => props.$color}05;
  border-color: ${(props) => props.$color}11;
`;

const AlertButton = styled.button<{ $color: string }>`
  color: ${(props) => props.$color}AA;
  padding: 0;
  align-self: flex-start;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  margin-right: 8px;
  margin-top: 8px;
`;

const IconRoot = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.$color}1A;
  color: ${(props) => props.$color};
  padding: 8px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  margin-right: 8px;
  vertical-align: middle;
`;

const AlertMap: Record<
  AlertType,
  { Icon: Icon; color: keyof typeof SYSTEM_COLORS }
> = {
  [AlertType.Info]: { Icon: InfoIcon, color: "info" },
  [AlertType.Error]: { Icon: AlertTriangle, color: "danger" },
  [AlertType.Warning]: { Icon: AlertTriangle, color: "warning" },
  [AlertType.Success]: { Icon: ThumbsUp, color: "success" },
};

const Content = styled.div`
  width: 100%;
  margin: 4px 0;
  align-self: center;
`;

const Text = styled(Typo.XS)<{ $color: string }>`
  color: ${(props) => props.$color};
`;

export function Alert({ type, message, renderJsx, action }: IProps) {
  const renderMode = useToggle(true);
  const { Icon: IconCmp, color } = AlertMap[type];
  useEffect(() => {
    renderMode.on();
  }, [message]);

  if (!renderMode.isOn || !message) {
    return null;
  }

  const hexColor = SYSTEM_COLORS[color];

  return (
    <Root type={type} $color={hexColor} role="alert">
      <IconRoot $color={hexColor}>
        <IconCmp size={20} />
      </IconRoot>
      <Content>
        <Text $color={hexColor}>
          {(renderJsx ? message : getBestErrorMessage(message)) as string}
        </Text>
        {action && (
          <>
            <Spacer />
            <SoftButtonStyled onClick={action.action} $color={color} size="xs">
              <Stack>
                <action.Icon size="14" />
                {action.label}
              </Stack>
            </SoftButtonStyled>
          </>
        )}
      </Content>
      {type !== AlertType.Error && (
        <AlertButton
          type="button"
          onClick={renderMode.off}
          $color={hexColor}
          aria-label="Close"
        >
          <X size={16} />
        </AlertButton>
      )}
    </Root>
  );
}

export function ErrorAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Error} />;
}
export function SuccessAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Success} />;
}
export function InfoAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Info} />;
}
export function WarningAlert(props: IAlert) {
  return <Alert {...props} type={AlertType.Warning} />;
}
