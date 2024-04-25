import styled from "styled-components";
import { Frown } from "react-feather";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { useLingui } from "@lingui/react";
import { SoftButton } from "../Button/SoftButton";
import { IEmptyWrapperProps } from "./types";

const Root = styled.div`
  text-align: center;
  padding: 30px;
  padding-bottom: 20px;
  border-radius: 0.25rem;
  background: ${USE_ROOT_COLOR("base-color")};
`;

export function EmptyWrapper({ text, createNew }: IEmptyWrapperProps) {
  const { _ } = useLingui();
  return (
    <Root>
      <Frown size={50} color={USE_ROOT_COLOR("muted-text")} />
      <Spacer size="xxl" />
      <Typo.MD $color="muted"> {_(text)} </Typo.MD>
      {createNew && (
        <>
          <Spacer size="xxl" />
          <SoftButton
            action={createNew.action}
            systemIcon="Plus"
            label={createNew.label}
          />
        </>
      )}
    </Root>
  );
}
