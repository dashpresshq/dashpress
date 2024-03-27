import React from "react";
import { LayoutImplementation } from "./LayoutImpl";
import { IsSignedIn } from "./IsSignedIn";
import { MainContent, IMainContentProps } from "./_MainContent";
import { PortalProvider } from "./portal";
import { useAppTheme } from "../useAppTheme";

export function AppLayout({
  children,
  actionItems = [],
  secondaryActionItems = [],
}: IMainContentProps) {
  useAppTheme();
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
