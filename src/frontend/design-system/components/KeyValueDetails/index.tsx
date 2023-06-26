import React, { ReactNode } from "react";
import { StringFilters } from "@hadmean/protozoa";
import styled from "styled-components";
import { Typo } from "../../primitives";
import { ISystemStatusForDisplay } from "../../types";
import { BadgeBuilder } from "./BadgeBuilder";
import { ListSkeleton } from "../Skeleton/List";

export enum KeyValueDetailsFormat {
  Money = "money",
  Number = "number",
  Status = "status",
}

export const KeyValueDetailsIconProps = {
  size: 15,
  color: "#a4abc5",
};

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.25rem;
  margin: -0.75rem;
`;

interface IKeyValueDetails {
  keyValues: {
    key: string;
    icon?: ReactNode;
    value: string | number | undefined;
    format?: KeyValueDetailsFormat;
    statuses?: ISystemStatusForDisplay[];
  }[];
  isLoading?: boolean;
}

// :eyes throw error if statuses is not provided when it is KeyValueDetailsFormat
export function KeyValueDetails({ isLoading, keyValues }: IKeyValueDetails) {
  if (isLoading) {
    return <ListSkeleton count={Object.entries(keyValues).length} />;
  }
  return (
    <Root>
      {keyValues.map(({ key, value, format, statuses, icon }) => {
        let valueToRender = <span>{value}</span>;
        switch (format) {
          case KeyValueDetailsFormat.Status:
            if (statuses) {
              valueToRender = (
                <BadgeBuilder
                  value={value as string}
                  statusSelections={statuses}
                />
              );
            }
            break;
          case KeyValueDetailsFormat.Number:
            valueToRender = <>{StringFilters.formatCount(value)}</>;
            break;
        }
        return (
          <li
            key={key}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              {icon}{" "}
              <Typo.MD color="muted" as="span">
                {key}
              </Typo.MD>
            </div>
            {valueToRender}
          </li>
        );
      })}
    </Root>
  );
}
