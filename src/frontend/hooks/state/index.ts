import { useEffect } from "react";
import { useSessionStorage } from "react-use";

export function useContextState<T>(
  domain: string,
  context: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [contextState, setContextState] = useSessionStorage<Record<string, T>>(
    `${domain}-context-state`,
    {}
  );

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
