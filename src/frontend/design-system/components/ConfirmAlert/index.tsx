import { confirmAlert } from "react-confirm-alert";
import styled, { keyframes } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Stack } from "frontend/design-system/primitives/Stack";
import { msg, t } from "@lingui/macro";
import { Z_INDEXES } from "../../constants/zIndex";
import { SoftButton } from "../Button/SoftButton";
import { SHADOW_CSS } from "../Card";

interface IProps {
  action: () => void;
  title: string;
}

const Body = styled.div`
  width: 300px;
  padding: 30px;
  text-align: center;
  background: ${USE_ROOT_COLOR("base-color")};
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  ${SHADOW_CSS}
  color: ${USE_ROOT_COLOR("main-text")};
`;

const fadeIn = keyframes`
from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const Overlay = styled(Stack).attrs({
  $direction: "column",
  $align: "center",
  $justify: "center",
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${Z_INDEXES.confirmDelete};
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  animation: ${fadeIn} 0.1s 0.1s forwards;
`;

export interface IPresentationProps extends IProps {
  onClose: () => void;
}

export function Presentation({ action, title, onClose }: IPresentationProps) {
  return (
    <Overlay
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm_delete_label"
      aria-describedby="confirm_delete_description"
      tabIndex={-1}
    >
      <Body>
        <Typo.MD $weight="bold">
          <span id="confirm_delete_label"> {title} </span>
        </Typo.MD>
        <Spacer size="xl" />
        <Typo.XS>
          <span id="confirm_delete_description">
            {t`Are you sure you want to do this?`}
          </span>
        </Typo.XS>
        <Spacer size="xxl" />
        <Stack $justify="center" $spacing={8}>
          <SoftButton action={onClose} label={msg`Cancel`} systemIcon={null} />

          <SoftButton
            color="danger"
            size="sm"
            systemIcon={null}
            label={msg`Confirm`}
            action={() => {
              action();
              onClose();
            }}
          />
        </Stack>
      </Body>
    </Overlay>
  );
}

export const ConfirmAlert = (props: IProps) =>
  confirmAlert({
    customUI: ({ onClose }) => <Presentation {...props} onClose={onClose} />,
  });
