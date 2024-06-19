import { ReactNode, useEffect, useState } from "react";
import { SideBar } from "./SideBar";
import { SIDE_BAR_WIDTH_VARIATIONS } from "./constants";

export interface IProps {
  children: ReactNode;
}

export function NavigationSideBar({ children }: IProps) {
  const [isFullWidth, setIsFullWidth] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsFullWidth(window.innerWidth >= 768);
    }
  }, [typeof window !== "undefined"]);

  return (
    <div className="w-full flex flex-row">
      <SideBar isFullWidth={isFullWidth} setIsFullWidth={setIsFullWidth} />
      <div
        className="p-4 min-h-dvh block transition-all bg-foundation"
        style={{
          width: `calc(100vw - ${
            isFullWidth
              ? SIDE_BAR_WIDTH_VARIATIONS.full
              : SIDE_BAR_WIDTH_VARIATIONS.collapsed
          }px - 16px)`,
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
