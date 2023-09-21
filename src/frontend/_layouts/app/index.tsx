import React from "react";
import { LayoutImplementation } from "./LayoutImpl";
import { IsSignedIn } from "./IsSignedIn";
import { BaseLayout, IBaseLayoutProps } from "./_Base";
import { PortalProvider } from "./portal";

export function AppLayout({
  children,
  actionItems = [],
  secondaryActionItems = [],
}: IBaseLayoutProps) {
  return (
    <IsSignedIn>
      <PortalProvider>
        <LayoutImplementation>
          <BaseLayout
            actionItems={actionItems}
            secondaryActionItems={secondaryActionItems}
          >
            {children}
          </BaseLayout>
        </LayoutImplementation>
      </PortalProvider>
    </IsSignedIn>
  );
}
