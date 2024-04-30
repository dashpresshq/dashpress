import { AppStorage } from "frontend/lib/storage/app";
import { useEffect, useMemo, useState } from "react";

export const useTimeElapsedStorageState = (
  key: string,
  secondsToTurnOn: number
) => {
  const [state, setState] = useState<{
    state: "on" | "off" | "wait";
    timestampToSwitch: number;
  } | null>(AppStorage.get(key));

  useEffect(() => {
    if (state) {
      AppStorage.set(key, state);
    }
  }, [state]);

  useEffect(() => {
    if (!state) {
      return setState({
        state: "wait",
        timestampToSwitch: new Date().getTime() + secondsToTurnOn * 1000,
      });
    }
    if (
      state.state === "wait" &&
      new Date().getTime() > state.timestampToSwitch
    ) {
      setState({ state: "on", timestampToSwitch: 0 });
    }
  }, []);

  return useMemo(() => {
    return {
      state: state?.state === "on",
      off: () => {
        setState({ state: "off", timestampToSwitch: 0 });
      },
    };
  }, [state]);
};
