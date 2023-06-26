import React, { ReactNode, useId } from "react";
import { Tooltip as BaseTooltip } from "react-tooltip";

export interface IProps {
  children: ReactNode;
  text: string;
  place?: React.ComponentProps<typeof BaseTooltip>["place"];
  offset?: number;
}

export function Tooltip({ children, text, place = "right", offset }: IProps) {
  const id = useId();
  return (
    <>
      <span id={id}> {children} </span>
      <BaseTooltip anchorId={id} content={text} place={place} offset={offset} />
    </>
  );
}
