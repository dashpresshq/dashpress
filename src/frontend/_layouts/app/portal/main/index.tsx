import { ReactNode } from "react";

export function PortalProvider({ children }: { children: ReactNode }) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
