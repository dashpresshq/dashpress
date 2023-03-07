import { BaseSkeleton, SectionBox, Spacer, Typo } from "@hadmean/chromista";
import { useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { dataNotFoundMessage, useApi } from "@hadmean/protozoa";
import { Fragment } from "react";
import { BaseSettingsLayout } from "../_Base";
import { SETTINGS_VIEW_KEY } from "../constants";

export function VersionInfo() {
  useSetPageDetails({
    pageTitle: "Version Information",
    viewKey: SETTINGS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_CONFIGURE_APP,
  });

  const systemVersions = useApi<Record<string, string>>("/api/versions", {
    errorMessage: dataNotFoundMessage("System Version"),
  });

  return (
    <BaseSettingsLayout>
      <SectionBox title="Version Information">
        <ViewStateMachine
          loading={systemVersions.isLoading}
          error={systemVersions.error}
          loader={
            <>
              {Array.from({ length: 2 }, (_, k) => k).map((key) => (
                <Fragment key={key}>
                  <BaseSkeleton height="18px" width="100px" bottom={8} />
                  <BaseSkeleton height="20px" bottom={16} />
                </Fragment>
              ))}
            </>
          }
        >
          {Object.entries(systemVersions.data || {}).map(([label, value]) => (
            <Fragment key={label}>
              <Typo.XS weight="bold">{label}</Typo.XS>
              {value}
              <Spacer />
            </Fragment>
          ))}
        </ViewStateMachine>
      </SectionBox>
    </BaseSettingsLayout>
  );
}
