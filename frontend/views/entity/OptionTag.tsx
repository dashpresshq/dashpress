import { lighten } from "polished";
import styled from "styled-components";
import { Text } from "@gothicgeeks/design-system";
import { IColorableSelection } from "./Configure/Fields/types";

const DEFAULT_TAG_COLOR = "#000000";

const Root = styled.div<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.color || DEFAULT_TAG_COLOR};
  background: ${(props) => lighten(0.45, props.color || DEFAULT_TAG_COLOR)};
`;

export function OptionTag({ color, label }: IColorableSelection) {
  return (
    <Root color={color}>
      <Text size="5"> {label} </Text>
    </Root>
  );
}
