import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SystemIconsKeys } from "shared/constants/Icons";
import { ellipsis } from "shared/lib/strings";
import { Trans, msg } from "@lingui/macro";
import { MessageDescriptor } from "@lingui/core";
import { useConstantNavigationMenuItems } from "./portal";
import { DropDownMenu } from "@/components/app/drop-drop-menu";

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
    <div className="flex justify-between items-center p-4 pb-0 mb-4">
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
        className="[&_svg]:text-white bg-[hsla(var(--dp-primary),0.6)] hover:bg-[hsla(var(--dp-primary),0.9)]"
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
