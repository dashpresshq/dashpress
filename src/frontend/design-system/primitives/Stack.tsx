import styled from "styled-components";

export type StackProps = {
  $spacing: number;
  $flex: number;
  $direction: "column";
  $align:
    | "normal"
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "self-start"
    | "self-end"
    | "flex-start"
    | "baseline"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  $justify:
    | "normal"
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "self-start"
    | "self-end"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  $width: string;
};

const spacings: Record<string, string> = {
  row: "columnGap",
  column: "rowGap",
};

export const Stack = styled.div<Partial<StackProps>>(
  ({
    $direction,
    $spacing = 8,
    $align = "normal",
    $justify = "normal",
    $flex,
    $width = "100%",
  }) => ({
    display: "flex",
    flex: $flex,
    flexDirection: $direction || "row",
    [spacings[$direction || "row"]]: `${$spacing}px`,
    alignItems: $align,
    justifyContent: $justify,
    width: $width,
  })
);
