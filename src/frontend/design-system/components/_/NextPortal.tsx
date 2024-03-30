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
  }, []);

  return isMounted.isOn && ref.current
    ? createPortal(children, ref.current)
    : null;
}
