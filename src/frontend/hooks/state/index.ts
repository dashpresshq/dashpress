import { useSessionStorage } from "react-use";

export function useContextState<T>(
  domain: string,
  context: string,
  defaultValue: T
): [T, (value: T) => void] {
  const key = `${domain}-${context}`;
  const [contextState, setContextState] = useSessionStorage<Record<string, T>>(
    "context-state",
    {}
  );

  const setValue = (value: T) => {
    setContextState({ ...contextState, [key]: value });
  };

  return [contextState[key] || defaultValue, setValue];
}
