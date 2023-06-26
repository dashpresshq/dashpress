import { useState, useRef, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";

interface IProps {
  children: ReactNode;
}

export function NextPortal({ children }: IProps) {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.body;
    setMounted(true);
  }, []);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
}
