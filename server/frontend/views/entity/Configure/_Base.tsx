import {
  SectionLeft,
  SectionRight,
  SectionRow,
  MenuSection,
} from "@gothicgeeks/design-system";
import { ReactNode } from "react";
import {
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { AppLayout } from "../../../_layouts/app";

interface IProps {
  children: ReactNode;
  menuItem: { link: string; name: string };
}

export const BaseEntitySettingsLayout = ({ children, menuItem }: IProps) => {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();

  return (
    <AppLayout
      titleNeedsContext={true}
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        { label: menuItem.name, value: menuItem.link },
      ]}
    >
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
                name: "Diction",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity),
                name: "CRUD",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.ACTIONS(entity),
                name: "Actions",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity),
                name: "Fields", // labels and validations and type
                disabled: false,
              },
              // Computed Table fields
              // Computed Details fields
            ]}
            currentMenuItem={menuItem.link}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
};
