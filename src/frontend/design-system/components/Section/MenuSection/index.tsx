import React from "react";
import { Icon } from "react-feather";
import styled from "styled-components";
import { SHADOW_CSS, CardBody } from "../../Card";
import { RenderList } from "../../RenderList";
import { SectionListItem } from "../SectionList";

export interface IMenuSectionItem {
  name: string;
  order?: number;
  action: string | (() => void);
  IconComponent?: Icon;
  disabled?: boolean;
}

export interface IProps {
  menuItems: IMenuSectionItem[];
  currentMenuItem?: string;
}

const Root = styled(CardBody)`
  ${SHADOW_CSS}
`;

export function MenuSection({ menuItems, currentMenuItem }: IProps) {
  const orderedMenuItems = menuItems.sort((a, b) => {
    const aOrder = a.order ?? 10;
    const bOrder = b.order ?? 10;

    return aOrder - bOrder;
  });

  return (
    <Root>
      <RenderList
        items={orderedMenuItems}
        notSearchable
        newItemLink=""
        singular=""
        render={(menuItem) => (
          <SectionListItem
            label={menuItem.name}
            action={menuItem.action}
            active={(typeof menuItem.action === "string"
              ? menuItem.action
              : ""
            ).includes(`${currentMenuItem}`)}
            disabled={!!menuItem.disabled}
            key={menuItem.name}
            IconComponent={menuItem.IconComponent}
          />
        )}
      />
    </Root>
  );
}
