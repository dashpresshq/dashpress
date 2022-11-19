import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useRouteParam, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { BaseActionsLayout } from "../_Base";
import { DEFAULT_ACTION_KEY } from "../constants";

export function ActionSettings() {
  const key = useRouteParam("key") || DEFAULT_ACTION_KEY;

  useSetPageDetails({
    pageTitle: "Actions Settings",
    viewKey: "ACTIONS_VIEW_KEY",
    permission: USER_PERMISSIONS.CAN_MANAGE_ACTIONS,
  });

  return (
    <BaseActionsLayout>
      <SectionBox title="Site Settings">
        <ViewStateMachine
          loading={false}
          error=""
          loader={
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
              ]}
            />
          }
        >
          {key}
        </ViewStateMachine>
      </SectionBox>
    </BaseActionsLayout>
  );
}
