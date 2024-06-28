import { Fragment } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export enum FormSkeletonSchema {
  Textarea = "60px",
  Input = "36px",
  RichTextArea = "277px",
}

export interface IProps {
  schema: FormSkeletonSchema[];
}

export function FormSkeleton({ schema }: IProps) {
  return (
    <div className="pt-2">
      {Array.from({ length: schema.length }, (_, k) => k).map((key) => (
        <Fragment key={key}>
          <Skeleton className="h-4 w-12 mb-1" />
          <Skeleton
            style={{
              height: schema[key],
            }}
            className="mb-6"
          />
        </Fragment>
      ))}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-32 mb-1 -mt-2" />
      </div>
    </div>
  );
}
