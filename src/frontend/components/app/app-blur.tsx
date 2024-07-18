import type { ReactNode } from "react";
import { useEffect } from "react";

interface IProps {
  children: ReactNode;
  isOn: boolean;
}

const gaussianPortals = ["gaussian-portal-0", "gaussian-portal-1"];

export function AppBlur({ children, isOn }: IProps): JSX.Element {
  useEffect(() => {
    if (isOn) {
      gaussianPortals.forEach((portal) => {
        document.getElementById(portal)?.classList.add("gaussian-blur");
      });
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 500);
    } else {
      gaussianPortals.forEach((portal) => {
        document.getElementById(portal)?.classList.remove("gaussian-blur");
      });
    }
  }, [isOn]);

  return children as JSX.Element;
}
