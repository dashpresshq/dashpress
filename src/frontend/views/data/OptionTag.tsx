import styled from "styled-components";
import { Typo } from "frontend/design-system/primitives/Typo";
import { IColorableSelection } from "shared/types/ui";
import { useLingui } from "@lingui/react";

const DEFAULT_TAG_COLOR = "#000000";

const Root = styled.div<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.color || DEFAULT_TAG_COLOR};
  background: ${(props) => props.color || DEFAULT_TAG_COLOR}1A;
`;

const TextColor = styled(Typo.SM)<{ $customColor: string }>`
  color: ${(props) => props.$customColor};
`;

export function OptionTag({ color, label }: IColorableSelection) {
  const { _ } = useLingui();
  return (
    <Root color={color}>
      <TextColor $customColor={color}>{_(label)}</TextColor>
    </Root>
  );
}
