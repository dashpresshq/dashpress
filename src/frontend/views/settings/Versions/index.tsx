import { UserPermissions } from "shared/constants/user";
import { Fragment } from "react";
import { useApi } from "frontend/lib/data/useApi";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { msg } from "@lingui/macro";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { useDomainMessages } from "frontend/lib/crud-config";
import { SectionBox } from "@/components/app/section-box";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { SETTINGS_VIEW_KEY } from "../constants";
import { BaseSettingsLayout } from "../_Base";
import { Skeleton } from "@/components/ui/skeleton";

export function VersionInfo() {
  const domainMessages = useDomainMessages({
    plural: msg`System Info`,
    singular: msg`System Info`,
  });

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: SETTINGS_VIEW_KEY,
    permission: UserPermissions.CAN_CONFIGURE_APP,
  });

  const systemVersions = useApi<Record<string, string>>("/api/versions", {
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
    defaultData: {},
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title={domainMessages.TEXT_LANG.TITLE}>
        <ViewStateMachine
          loading={systemVersions.isLoading}
          error={systemVersions.error}
          loader={
            <>
              {Array.from({ length: 4 }, (_, k) => k).map((key) => (
                <Fragment key={key}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-5 mb-4" />
                </Fragment>
              ))}
            </>
          }
        >
          {typescriptSafeObjectDotEntries(systemVersions.data).map(
            ([label, value]) => (
              <div className="mb-3" key={label}>
                <p className="text-xs font-semibold">{label}</p>
                <p className="text-sm">{value}</p>
              </div>
            )
          )}
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
