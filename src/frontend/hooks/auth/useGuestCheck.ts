import { useEffect } from "react";
import { AuthActions } from "./auth.actions";
import { useToggle } from "../state/useToggleState";

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
