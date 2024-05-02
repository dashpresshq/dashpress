import { ReactNode, useEffect } from "react";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { ComponentIsLoading } from "frontend/design-system/components/ComponentIsLoading";
import { useToggle } from "frontend/hooks/state/useToggleState";

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
