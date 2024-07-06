import type { MessageDescriptor } from "@lingui/core";
import { msg, Trans } from "@lingui/macro";
import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import type { SystemIconsKeys } from "shared/constants/Icons";
import { ellipsis } from "shared/lib/strings";

import { DropDownMenu } from "@/components/app/drop-drop-menu";

import { useConstantNavigationMenuItems } from "./portal";

interface IProps {
  isFullWidth: boolean;
}

const constantNavigation: Array<{
  systemIcon: SystemIconsKeys;
  label: MessageDescriptor;
  action: string;
}> = [
  {
    label: msg`My Account`,
    systemIcon: "User",
    action: NAVIGATION_LINKS.ACCOUNT.PROFILE,
  },
];

export function ProfileOnNavigation({ isFullWidth }: IProps) {
  const currentUser = useAuthenticatedUserBag();

  const constantNavigationMenuItems = useConstantNavigationMenuItems();

  if (!isFullWidth) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center justify-between p-4 pb-0">
      <p className="text-xs font-semibold text-white">
        <Trans>
          Hi,{" "}
          {currentUser.isLoading
            ? `There`
            : ellipsis(currentUser.data?.name, 14)}
        </Trans>
      </p>

      <DropDownMenu
        ellipsis
        ariaLabel="Toggle Profile Menu"
        className="bg-[hsla(var(--dp-primary),0.6)] hover:bg-[hsla(var(--dp-primary),0.9)] [&_svg]:text-white"
        menuItems={[...constantNavigation, ...constantNavigationMenuItems].map(
          ({ label, action, systemIcon }) => ({
            id: action,
            label,
            systemIcon,
            action,
          })
        )}
      />
    </div>
  );
}
