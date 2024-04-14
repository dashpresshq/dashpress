import React, { Fragment } from "react";
import { Stack } from "frontend/design-system/primitives/Stack";
import { BaseSkeleton } from "../Base";

export enum FormSkeletonSchema {
  Textarea = "83px",
  Input = "38px",
  RichTextArea = "277px",
}

export interface IProps {
  schema: FormSkeletonSchema[];
}

export function FormSkeleton({ schema }: IProps) {
  return (
    <div style={{ paddingTop: "8px" }}>
      {Array.from({ length: schema.length }, (_, k) => k).map((key) => (
        <Fragment key={key}>
          <BaseSkeleton height="1em" width="50px" bottom={5} />
          <BaseSkeleton height={schema[key]} bottom={24} />
        </Fragment>
      ))}
      <Stack $justify="end">
        <BaseSkeleton height="3em" width="120px" bottom={3} top={-8} />
      </Stack>
    </div>
  );
}
