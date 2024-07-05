import { useEffect } from "react";

import { useToggle } from "../state/useToggleState";
import { AuthActions } from "./auth.actions";

export const useGuestCheck = () => {
  const renderMode = useToggle();

  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (isClient) {
      if (AuthActions.isAuthenticated()) {
        AuthActions.signIn();
      } else {
        renderMode.on();
      }
    }
  }, [isClient]);
  return renderMode.isOn;
};
