import React from "react";
import { InfoAlert } from "frontend/design-system/components/Alert";
import { Copy } from "react-feather";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { ToastService } from "frontend/lib/toast";
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
          <InfoAlert
            renderJsx
            action={{
              action: () => {
                if (
                  navigator &&
                  navigator.clipboard &&
                  navigator.clipboard.writeText
                ) {
                  navigator.clipboard.writeText("npx dashpress");
                  ToastService.success("Command copied to clipboard");
                }
              },
              Icon: Copy,
              label: "$ npx dashpress",
            }}
            message={
              <span>
                <p>
                  <b>npx hadmean</b> has been deprecated.
                </p>
                <p>
                  We have rebranded to DashPress, hence we will only deploy new
                  versions to the `dashpress` package and no longer make any
                  release to the `hadmean` package.
                </p>
                <p>
                  The only thing you need to do is to run `npx dashpress`
                  instead of `npx hadmean`.
                </p>
                <p>
                  All your settings will be preserved as it is still the same
                  code just different name.
                </p>
              </span>
            }
          />
          <Spacer />
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
