import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import styled from "styled-components";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { Stack } from "frontend/design-system/primitives/Stack";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Typo } from "frontend/design-system/primitives/Typo";
import { ILabelValue } from "shared/types/options";
import { DropDownMenu } from "frontend/design-system/components/DropdownMenu";
import { useConstantNavigationMenuItems } from "./portal";

const ProfileRoot = styled(Stack)`
  padding: 16px;
  color: ${SYSTEM_COLORS.white};
  button {
    color: ${SYSTEM_COLORS.white};
  }
`;

const Name = styled(Typo.XS)`
  color: ${SYSTEM_COLORS.white};
`;

interface IProps {
  isFullWidth: boolean;
}

const constantNavigation: ILabelValue[] = [
  {
    label: "My Account",
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
    <ProfileRoot justify="space-between" align="center">
      <Name weight="bold">
        Hi, {currentUser.isLoading ? "There" : currentUser.data?.name}
      </Name>

      <DropDownMenu
        ellipsis
        ariaLabel="Toggle Profile Menu"
        menuItems={[...constantNavigation, ...constantNavigationMenuItems].map(
          ({ label, value }) => ({
            id: label,
            label,
            onClick: () => router.push(value),
          })
        )}
      />
    </ProfileRoot>
  );
}
