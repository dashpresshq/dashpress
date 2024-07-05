import { useToggle } from "frontend/hooks/state/useToggleState";
import type { ReactNode } from "react";
import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface IProps {
  children: ReactNode;
}

const gaussianPortals = ["gaussian-portal-0", "gaussian-portal-1"];

export function NextPortal({ children }: IProps) {
  const ref = useRef<Element | null>(null);
  const isMounted = useToggle();

  useEffect(() => {
    ref.current = document.body;
    isMounted.on();
    gaussianPortals.forEach((portal) => {
      document.getElementById(portal)?.classList.add("gaussian-blur");
    });

    return () => {
      gaussianPortals.forEach((portal) => {
        document.getElementById(portal)?.classList.remove("gaussian-blur");
      });

      isMounted.off();
    };
  }, []);

  return isMounted.isOn && ref.current
    ? createPortal(children, document.body)
    : null;
}
