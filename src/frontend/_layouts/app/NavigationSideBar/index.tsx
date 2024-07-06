import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { SIDE_BAR_WIDTH_VARIATIONS } from "./constants";
import { SideBar } from "./SideBar";

export interface IProps {
  children: ReactNode;
}

export function NavigationSideBar({ children }: IProps) {
  const [isFullWidth, setIsFullWidth] = useState(true);

  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (isClient) {
      setIsFullWidth(window.innerWidth >= 768);
    }
  }, [isClient]);

  return (
    <div className="flex w-full flex-row">
      <SideBar isFullWidth={isFullWidth} setIsFullWidth={setIsFullWidth} />
      <div
        className="block min-h-dvh bg-foundation p-4 transition-all"
        style={{
          width: `calc(100vw - ${
            isFullWidth
              ? SIDE_BAR_WIDTH_VARIATIONS.full
              : SIDE_BAR_WIDTH_VARIATIONS.collapsed
          }px)`,
          marginLeft: isFullWidth
            ? SIDE_BAR_WIDTH_VARIATIONS.full
            : SIDE_BAR_WIDTH_VARIATIONS.collapsed,
        }}
      >
        {children}
      </div>
    </div>
  );
}
