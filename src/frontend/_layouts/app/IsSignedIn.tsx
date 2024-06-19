import { ReactNode, useEffect } from "react";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { ComponentIsLoading } from "@/components/app/loading-component";

export function IsSignedIn({ children }: { children: ReactNode }) {
  const renderMode = useToggle();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!AuthActions.isAuthenticated()) {
        AuthActions.signOut();
      } else {
        renderMode.on();
      }
    }
  }, [typeof window]);

  if (renderMode.isOff) {
    return <ComponentIsLoading />;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
