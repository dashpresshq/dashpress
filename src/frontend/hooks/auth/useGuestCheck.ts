import { useEffect } from "react";
import { AuthActions } from "./auth.actions";
import { useToggle } from "../state/useToggleState";

export const useGuestCheck = () => {
  const renderMode = useToggle();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (AuthActions.isAuthenticated()) {
        AuthActions.signIn();
      } else {
        renderMode.on();
      }
    }
  }, [typeof window]);
  return renderMode.isOn;
};
