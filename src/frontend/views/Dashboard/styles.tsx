import type { CSSProperties, ReactNode } from "react";
import { forwardRef } from "react";
import type { GridSpanSizes } from "shared/types/ui";

export const WidgetRoot = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    span: GridSpanSizes;
    height: string;
  }
>(function WidgetRootCmp({ children, span, height }, ref) {
  return (
    <div
      ref={ref}
      style={
        {
          "--grid-span": span,
          "--grid-height": height,
        } as CSSProperties
      }
      className="grid-item row-start-[span_var(--grid-height)]"
    >
      {children}
    </div>
  );
});
