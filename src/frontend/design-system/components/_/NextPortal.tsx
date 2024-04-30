import { useToggle } from "frontend/hooks/state/useToggleState";
import { useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface IProps {
  children: ReactNode;
}

export function NextPortal({ children }: IProps) {
  const ref = useRef<Element | null>(null);
  const isMounted = useToggle();

  useEffect(() => {
    ref.current = document.body;
    isMounted.on();
    document.getElementById("__next")?.classList.add("gaussian-blur");

    return () => {
      document.getElementById("__next")?.classList.remove("gaussian-blur");

      isMounted.off();
    };
  }, []);

  return isMounted.isOn && ref.current
    ? createPortal(
        <>
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <filter id="gaussian-blur">
              <feGaussianBlur stdDeviation="0.3" />
            </filter>
          </svg>
          {children}
        </>,
        ref.current
      )
    : null;
}
