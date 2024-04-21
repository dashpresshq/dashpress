import { ComponentProps, ReactNode, useId } from "react";
import { Tooltip as BaseTooltip } from "react-tooltip";

export interface IProps {
  children: ReactNode;
  text: string;
  place?: ComponentProps<typeof BaseTooltip>["place"];
  offset?: number;
}

export function Tooltip({ children, text, place = "right", offset }: IProps) {
  const id = useId();
  if (!text) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
  return (
    <>
      <span id={id}> {children} </span>
      <BaseTooltip anchorId={id} html={text} place={place} offset={offset} />
    </>
  );
}
