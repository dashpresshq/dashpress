import { ReactNode } from "react";
import styled from "styled-components";
import { USE_ROOT_COLOR } from "../theme/root";
import { SYSTEM_COLORS } from "../theme/system";

const TEXT_COLORS = {
  main: USE_ROOT_COLOR("main-text"),
  muted: USE_ROOT_COLOR("muted-text"),
  inverse: USE_ROOT_COLOR("text-on-primary"),
  danger: SYSTEM_COLORS.danger,
};

export type TextProps = {
  $size: "1" | "2" | "3" | "4" | "5" | "6";
  $color: keyof typeof TEXT_COLORS;
  $weight: "light" | "regular" | "bold";
  $textStyle?: "italic";
  as: "p" | "span";
  id?: string;
  $ellipsis?: true;
  children: ReactNode;
};

const sizes: Record<TextProps["$size"], number> = {
  1: 32,
  2: 20,
  3: 16,
  4: 14,
  5: 12,
  6: 10,
};

const weights: Record<TextProps["$weight"], number> = {
  light: 300,
  regular: 400,
  bold: 500,
};

// @ts-ignore
const Text = styled.p.attrs((props: TextProps) => ({
  role: props.as || "p",
  id: props.id,
}))<Partial<TextProps>>(
  ({
    $size = "4",
    $color = "main",
    $weight = "regular",
    $textStyle,
    $ellipsis,
  }) => ({
    color: TEXT_COLORS[$color],
    fontStyle: $textStyle || "normal",
    fontWeight: weights[$weight],
    fontSize: `${sizes[$size]}px`,
    lineHeight: `${sizes[$size] * 1.25}px`,
    margin: 0,
    padding: 0,
    textOverflow: $ellipsis ? "ellipsis" : undefined,
    whiteSpace: $ellipsis ? "nowrap" : undefined,
    overflow: $ellipsis ? "hidden" : undefined,
  })
);

type RawTypoProps = Partial<TextProps>;
type TypoProps = Omit<RawTypoProps, "size">;

export function Typo(props: Partial<TypoProps>) {
  return <Text {...props} />;
}

Typo.Raw = function Raw(props: TypoProps & { size: TextProps["$size"] }) {
  return <Text {...props} />;
};

Typo.XL = function XLarge(props: TypoProps) {
  return <Text {...props} $size="1" />;
};

Typo.L = function Large(props: TypoProps) {
  return <Text {...props} $size="2" />;
};

Typo.MD = function Medium(props: TypoProps) {
  return <Text {...props} $size="3" />;
};

Typo.SM = function Small(props: TypoProps) {
  return <Text {...props} $size="4" />;
};

Typo.XS = function XSmall(props: TypoProps) {
  return <Text {...props} $size="5" />;
};

Typo.XXS = function XSmall(props: TypoProps) {
  return <Text {...props} $size="6" />;
};
