import { useEffect, useState } from "react";

export function useContextState<T>(
  context: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [contextState, setContextState] = useState<Record<string, T>>({});

  const setState = (newState: T) => {
    setContextState({
      ...contextState,
      [context]: newState,
    });
  };

  useEffect(() => {
    if (!contextState[context]) {
      setState(defaultValue);
    }
  }, [context]);

  return [contextState[context] || defaultValue, setState];
}
