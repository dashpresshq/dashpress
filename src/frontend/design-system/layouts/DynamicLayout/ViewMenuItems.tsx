import React from "react";
import { RenderList, SectionListItem, SoftButton } from "../../components";
import { Spacer } from "../../ui-blocks";
import { IViewMenuItems } from "../types";

interface Props {
  viewMenuItems: IViewMenuItems;
}

export function ViewMenuItems({
  viewMenuItems: { menuItems, singular, newItemLink, topAction, getLabel },
}: Props) {
  return (
    <>
      {topAction && (
        <>
          <SoftButton
            action={topAction?.action}
            block
            label={topAction.title}
            icon="settings"
          />
          <Spacer size="xxl" />
        </>
      )}
      <RenderList
        isLoading={menuItems?.isLoading && 20}
        items={(menuItems?.data || []).map(({ value, ...rest }) => ({
          name: value,
          ...rest,
        }))}
        getLabel={getLabel}
        singular={singular}
        newItemLink={newItemLink}
        error={menuItems?.error}
        render={({ label, action, secondaryAction }) => (
          <SectionListItem
            label={label}
            action={action}
            secondaryAction={secondaryAction}
            key={label}
          />
        )}
      />
    </>
  );
}
