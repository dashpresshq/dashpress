import React from "react";
import { LayoutImplementation } from "./LayoutImpl";
import { IsSignedIn } from "./IsSignedIn";
import { MainContent, IMainContentProps } from "./_MainContent";
import { PortalProvider } from "./portal";

export function AppLayout({
  children,
  actionItems = [],
  secondaryActionItems = [],
}: IMainContentProps) {
  return (
    <IsSignedIn>
      <PortalProvider>
        <LayoutImplementation>
          <MainContent
            actionItems={actionItems}
            secondaryActionItems={secondaryActionItems}
          >
            {children}
          </MainContent>
        </LayoutImplementation>
      </PortalProvider>
    </IsSignedIn>
  );
}
