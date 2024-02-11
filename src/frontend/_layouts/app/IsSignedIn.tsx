import React, { ReactNode, useEffect } from "react";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { ComponentIsLoading } from "frontend/design-system/components/ComponentIsLoading";

export function IsSignedIn({ children }: { children: ReactNode }) {
  const [render, setRender] = React.useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!AuthActions.isAuthenticated()) {
        AuthActions.signOut("IsSignedIn");
      } else {
        setRender(true);
      }
    }
  }, [typeof window]);

  if (!render) {
    return <ComponentIsLoading />;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
