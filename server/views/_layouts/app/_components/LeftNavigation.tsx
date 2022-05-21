import {
  Header,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  SideNavigation,
} from "@atlaskit/side-navigation";
import { ButtonItem, Section } from "@atlaskit/menu";
import { INavigationItem } from "../../types";

export const LeftNavigation: React.FC<{
  navigationItems: INavigationItem[];
}> = ({ navigationItems }) => {
  return (
    <SideNavigation label="Project navigation" testId="side-navigation">
      <NavigationHeader>
        <Header>Navigation</Header>
      </NavigationHeader>
      <Section>
        {navigationItems.map(({ title, link }) => (
          <ButtonItem key={title}>{title}</ButtonItem>
        ))}
      </Section>
    </SideNavigation>
  );
};
