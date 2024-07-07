import type { ReactNode } from "react";
import { useEffect } from "react";

import { ComponentIsLoading } from "@/components/app/loading-component";
import { AuthActions } from "@/frontend/hooks/auth/auth.actions";
import { useToggle } from "@/frontend/hooks/state/useToggleState";

export function IsSignedIn({ children }: { children: ReactNode }) {
  const renderMode = useToggle();

  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (isClient) {
      if (!AuthActions.isAuthenticated()) {
        AuthActions.signOut();
      } else {
        renderMode.on();
      }
    }
  }, [isClient]);

  if (renderMode.isOff) {
    return <ComponentIsLoading fullPage />;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
