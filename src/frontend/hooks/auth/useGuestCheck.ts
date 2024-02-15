import { useEffect, useState } from "react";
import { AuthActions } from "./auth.actions";

export const useGuestCheck = () => {
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (AuthActions.isAuthenticated()) {
        AuthActions.signIn();
      } else {
        setRender(true);
      }
    }
  }, [typeof window]);
  return render;
};
