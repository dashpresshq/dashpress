import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import styled from "styled-components";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { Stack } from "frontend/design-system/primitives/Stack";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Typo } from "frontend/design-system/primitives/Typo";
import { DropDownMenu } from "frontend/design-system/components/DropdownMenu";
import { SystemIconsKeys } from "shared/constants/Icons";
import { ellipsis } from "shared/lib/strings";
import { Trans, msg } from "@lingui/macro";
import { MessageDescriptor } from "@lingui/core";
import { useConstantNavigationMenuItems } from "./portal";

const ProfileRoot = styled(Stack)`
  padding: 16px;
  color: ${SYSTEM_COLORS.white};
  button {
    color: ${SYSTEM_COLORS.white};
  }
`;

const Name = styled(Typo.SM)`
  color: ${SYSTEM_COLORS.white};
`;

interface IProps {
  isFullWidth: boolean;
}

const constantNavigation: Array<{
  systemIcon: SystemIconsKeys;
  label: MessageDescriptor;
  value: string;
}> = [
  {
    label: msg`My Account`,
    systemIcon: "User",
    value: NAVIGATION_LINKS.ACCOUNT.PROFILE,
  },
];

export function ProfileOnNavigation({ isFullWidth }: IProps) {
  const currentUser = useAuthenticatedUserBag();

  const router = useRouter();

  const constantNavigationMenuItems = useConstantNavigationMenuItems();

  if (!isFullWidth) {
    return null;
  }

  return (
    <ProfileRoot $justify="space-between" $align="center">
      <Name $weight="bold">
        <Trans>
          Hi,{" "}
          {currentUser.isLoading
            ? `There`
            : ellipsis(currentUser.data?.name, 14)}
        </Trans>
      </Name>

      <DropDownMenu
        ellipsis
        ariaLabel="Toggle Profile Menu"
        menuItems={[...constantNavigation, ...constantNavigationMenuItems].map(
          ({ label, value, systemIcon }) => ({
            id: value,
            label,
            systemIcon,
            action: () => router.push(value),
          })
        )}
      />
    </ProfileRoot>
  );
}
