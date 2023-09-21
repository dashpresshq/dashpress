import { useAuthenticatedUserBag } from "frontend/hooks/auth/user.store";
import { MoreVertical } from "react-feather";
import styled from "styled-components";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { Stack } from "frontend/design-system/primitives/Stack";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { Dropdown } from "frontend/design-system/components/Dropdown";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Typo } from "frontend/design-system/primitives/Typo";
import { ILabelValue } from "shared/types/options";
import { useConstantNavigationMenuItems } from "./portal";

const DownRoot = styled(Stack)`
  padding: 8px 0;
  min-width: 180px;
`;

const ProfileRoot = styled(Stack)`
  padding: 16px;
  color: ${SYSTEM_COLORS.white};
`;

const Name = styled(Typo.XS)`
  color: ${SYSTEM_COLORS.white};
`;

const StyledDropDownItem = styled.button`
  display: block;
  width: 100%;
  padding: 6px 12px;
  cursor: pointer;
  color: ${USE_ROOT_COLOR("main-text")};
  text-align: inherit;
  background: ${USE_ROOT_COLOR("base-color")};
  border: 0;
  &:hover {
    background-color: ${USE_ROOT_COLOR("soft-color")};
    color: ${USE_ROOT_COLOR("main-text")};
  }
`;

interface IProps {
  isFullWidth: boolean;
}

export function ProfileOnNavigation({ isFullWidth }: IProps) {
  const currentUser = useAuthenticatedUserBag();

  const router = useRouter();

  if (!isFullWidth) {
    return null;
  }

  const constantNavigationMenuItems = useConstantNavigationMenuItems();

  const constantNavigation: ILabelValue[] = [
    {
      label: "My Account",
      value: NAVIGATION_LINKS.ACCOUNT.PROFILE,
    },
  ];

  return (
    <ProfileRoot justify="space-between" align="center">
      <Name weight="bold">
        Hi, {currentUser.isLoading ? "User" : currentUser.data?.name}
      </Name>
      <Dropdown
        width={250}
        preserveVisibiltyOnClick
        align="right"
        target={<MoreVertical size={16} style={{ cursor: "pointer" }} />}
      >
        <DownRoot direction="column">
          {[...constantNavigation, ...constantNavigationMenuItems].map(
            ({ label, value }) => (
              <StyledDropDownItem
                key={label}
                onClick={() => router.push(value)}
              >
                {label}
              </StyledDropDownItem>
            )
          )}
        </DownRoot>
      </Dropdown>
    </ProfileRoot>
  );
}
