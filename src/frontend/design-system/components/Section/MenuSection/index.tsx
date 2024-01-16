import React from "react";
import styled from "styled-components";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { SystemIconsKeys } from "shared/constants/Icons";
import { SHADOW_CSS, CardBody } from "../../Card";
import { ListManager } from "../../ListManager";
import { IListMangerItemProps } from "../../ListManager/ListManagerItem";

export interface IMenuSectionItem {
  name: string;
  order?: number;
  action: string | (() => void);
  systemIcon?: SystemIconsKeys;
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
      <ListManager
        items={loadedDataState(orderedMenuItems)}
        listLengthGuess={10}
        labelField="name"
        render={(menuItem) => {
          const props: IListMangerItemProps = {
            label: menuItem.name,
            action: menuItem.action,
            active: (typeof menuItem.action === "string"
              ? menuItem.action
              : ""
            ).includes(`${currentMenuItem}`),
            disabled: !!menuItem.disabled,
            systemIcon: menuItem.systemIcon,
          };
          return props;
        }}
      />
    </Root>
  );
}
