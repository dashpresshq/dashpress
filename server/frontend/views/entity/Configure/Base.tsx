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
                link: NAVIGATION_LINKS.ENTITY.CONFIG.TABLE(entity),
                name: "Table",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity),
                name: "CRUD",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.CREATE(entity),
                name: "Create",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.UPDATE(entity),
                name: "Update",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.DETAILS(entity),
                name: "Details",
                disabled: false,
              },
              {
                link: NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity),
                name: "Fields",
                disabled: false,
              },
            ]}
            currentMenuItem={menuItem.link}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
};
