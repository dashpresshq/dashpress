import { DynamicLayout } from "@hadmean/chromista";
import React from "react";
import { User } from "react-feather";
import { useSiteConfig } from "frontend/hooks/app/site.config";
import { useSelectionViews } from "./useSelectionViews";
import { BaseLayout, IBaseLayoutProps, IsSignedIn } from "../../_Base";
import { ROOT_LINKS_TO_CLEAR_BREADCRUMBS } from "../../constants";

export function AppLayout({
  children,
  actionItems = [],
  secondaryActionItems = [],
}: IBaseLayoutProps) {
  const selectionViews = useSelectionViews();
  const siteConfig = useSiteConfig();

  return (
    <IsSignedIn>
      <DynamicLayout
        logo={siteConfig.logo}
        selectionView={selectionViews}
        secondarySelectionView={[
          {
            title: "Account",
            icon: User,
            action: ROOT_LINKS_TO_CLEAR_BREADCRUMBS.ACCOUNT,
          },
        ]}
      >
        <BaseLayout
          actionItems={actionItems}
          secondaryActionItems={secondaryActionItems}
        >
          {children}
        </BaseLayout>
      </DynamicLayout>
    </IsSignedIn>
  );
}
