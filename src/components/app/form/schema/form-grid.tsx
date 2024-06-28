import { CSSProperties, ReactNode } from "react";
import { GridSpanSizes } from "shared/types/ui";

export const FormGrid = {
  Root: ({ children }: { children: ReactNode }) => (
    <div className="@container">
      <div className="grid-root auto-rows-auto items-center">{children}</div>
    </div>
  ),
  Item: ({ children, span }: { children: ReactNode; span?: GridSpanSizes }) => (
    <div
      style={
        {
          "--grid-span": span,
        } as CSSProperties
      }
      className="grid-item"
    >
      {children}
    </div>
  ),
};
