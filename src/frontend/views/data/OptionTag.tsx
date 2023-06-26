import styled from "styled-components";
import { Typo } from "frontend/design-system/primitives/Text";
import { IColorableSelection } from "shared/types/ui";

const DEFAULT_TAG_COLOR = "#000000";

const Root = styled.div<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.color || DEFAULT_TAG_COLOR};
  background: ${(props) => props.color || DEFAULT_TAG_COLOR}1A;
`;

const TextColor = styled(Typo.SM)<{ customColor: string }>`
  color: ${(props) => props.customColor};
`;

export function OptionTag({ color, label }: IColorableSelection) {
  return (
    <Root color={color}>
      <TextColor customColor={color}>{label}</TextColor>
    </Root>
  );
}
