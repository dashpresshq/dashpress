import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { UserPermissions } from "shared/constants/user";

import { SectionBox } from "@/components/app/section-box";
import { Tabs } from "@/components/app/tabs";

import { BaseActionsLayout } from "../_Base";
import { ACTIONS_VIEW_KEY } from "../constants";
import { StorageCredentialsSettings } from "./Credentials";
import { GeneralStorageSettings } from "./General";

export function StorageIntegrations() {
  const fileStorageDomainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FILE_STORAGE
  );
  useSetPageDetails({
    pageTitle: fileStorageDomainMessages.TEXT_LANG.TITLE,
    viewKey: ACTIONS_VIEW_KEY,
    permission: UserPermissions.CAN_MANAGE_APP_CREDENTIALS,
  });

  return (
    <BaseActionsLayout>
      <SectionBox title={fileStorageDomainMessages.TEXT_LANG.TITLE}>
        <Tabs
          contents={[
            {
              label: msg`Setup`,
              id: "setup",
              content: <StorageCredentialsSettings />,
            },
            {
              label: msg`General`,
              id: "general",
              content: <GeneralStorageSettings />,
            },
          ]}
        />
      </SectionBox>
    </BaseActionsLayout>
  );
}
