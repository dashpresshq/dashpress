import {
  SectionLeft, SectionRight, SectionRow, MenuSection,
} from '@gothicgeeks/design-system';
import { ReactNode } from 'react';
import { NAVIGATION_LINKS } from '../../lib/routing/links';
import { AppLayout } from '../../_layouts/app';

interface IProps {
  children: ReactNode;
  menuItem: { link: string; name: string };
}

export function BaseSettingsLayout({ children, menuItem }: IProps) {
  return (
    <AppLayout titleNeedsContext breadcrumbs={[{ label: menuItem.name, value: menuItem.link }]}>
      <SectionRow>
        <SectionLeft>
          <MenuSection
            menuItems={[
              {
                link: NAVIGATION_LINKS.SETTINGS.ENTITIES,
                name: 'Entities',
              },
              {
                link: 'TODO',
                name: 'Other Settings',
              },
            ]}
            currentMenuItem={menuItem.link}
          />
        </SectionLeft>
        <SectionRight>{children}</SectionRight>
      </SectionRow>
    </AppLayout>
  );
}
