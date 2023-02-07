import { useSessionStorage } from "react-use";

export function useContextState<T>(
  domain: string,
  context: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [contextState, setContextState] = useSessionStorage<T>(
    `${domain}-${context}-context-state`,
    defaultValue
  );

  return [contextState, setContextState];
}
