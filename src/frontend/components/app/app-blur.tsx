import type { ReactNode } from "react";
import { useCallback, useEffect } from "react";

interface IProps {
  children: ReactNode;
  isOn: boolean;
}

const gaussianPortals = ["gaussian-portal-0", "gaussian-portal-1"];

export function AppBlur({ children, isOn }: IProps): JSX.Element {
  const removeBlur = useCallback(() => {
    gaussianPortals.forEach((portal) => {
      document.getElementById(portal)?.classList.remove("gaussian-blur");
    });
  }, []);

  useEffect(() => {
    if (isOn) {
      gaussianPortals.forEach((portal) => {
        document.getElementById(portal)?.classList.add("gaussian-blur");
      });
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 500);
    } else {
      removeBlur();
    }

    return () => {
      removeBlur();
    };
  }, [isOn]);

  return children as JSX.Element;
}
