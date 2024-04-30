import styled, { keyframes } from "styled-components";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Stack } from "frontend/design-system/primitives/Stack";
import { msg, t } from "@lingui/macro";
import { createStore } from "frontend/lib/store";
import { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useClickAway, useKey } from "react-use";
import { useEffect, useRef } from "react";
import { Z_INDEXES } from "../../constants/zIndex";
import { SoftButton } from "../Button/SoftButton";
import { SHADOW_CSS } from "../Card";
import { NextPortal } from "../_/NextPortal";

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

interface IConfirmAlertDetails {
  title: MessageDescriptor;
  action: () => void;
}

type IStore = {
  title?: MessageDescriptor;
  action?: () => void;
  setDetails: (details: IConfirmAlertDetails) => void;
  onClose: () => void;
};

const useConfirmAlertStore = createStore<IStore>((set) => ({
  setDetails: (details: IConfirmAlertDetails) => set(() => details),
  onClose: () =>
    set(() => ({
      title: undefined,
      action: undefined,
    })),
}));

export const useConfirmAlert = () => {
  const confirmAlert = useConfirmAlertStore((store) => store.setDetails);

  return confirmAlert;
};

export function ConfirmAlert() {
  const rootRef = useRef<HTMLDivElement>(null);

  const { _ } = useLingui();
  const [title, action, onClose] = useConfirmAlertStore((store) => [
    store.title,
    store.action,
    store.onClose,
  ]);

  useKey("Escape", onClose);
  useClickAway(rootRef, onClose);

  useEffect(() => {
    document.body.style.overflow = title ? "hidden" : "auto";
  }, [title]);

  if (!title) {
    return null;
  }

  return (
    <NextPortal>
      <Overlay
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm_delete_label"
        aria-describedby="confirm_delete_description"
        tabIndex={-1}
      >
        <Body ref={rootRef}>
          <Typo.MD $weight="bold">
            <span id="confirm_delete_label"> {_(title)} </span>
          </Typo.MD>
          <Spacer size="xl" />
          <Typo.XS>
            <span id="confirm_delete_description">
              {t`Are you sure you want to do this?`}
            </span>
          </Typo.XS>
          <Spacer size="xxl" />
          <Stack $justify="center" $spacing={8}>
            <SoftButton
              action={onClose}
              label={msg`Cancel`}
              systemIcon={null}
            />

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
    </NextPortal>
  );
}
