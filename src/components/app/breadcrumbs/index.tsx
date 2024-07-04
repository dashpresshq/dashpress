import * as React from "react";
import { ILabelValue } from "shared/types/options";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface IProps {
  items: ILabelValue[];
  onCrumbClick: (index: number) => void;
}

const ITEMS_TO_DISPLAY = 3;

export function Breadcrumbs({ items, onCrumbClick }: IProps) {
  const [open, setOpen] = React.useState(false);

  const itemsWithOriginalIndex = items.map((item, index) => ({
    ...item,
    index,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.length >= ITEMS_TO_DISPLAY && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button" onClick={() => onCrumbClick(0)}>
                  {items[0].label}
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        {items.length > ITEMS_TO_DISPLAY ? (
          <>
            <BreadcrumbItem>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger
                  className="flex items-center gap-1"
                  aria-label="Toggle menu"
                >
                  <BreadcrumbEllipsis className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {itemsWithOriginalIndex.slice(1, -2).map((item) => (
                    <DropdownMenuItem key={item.index}>
                      <button
                        type="button"
                        className="text-xs"
                        onClick={() => onCrumbClick(item.index)}
                      >
                        {item.label}
                      </button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : null}
        {itemsWithOriginalIndex.slice(-ITEMS_TO_DISPLAY + 1).map((item) => (
          <React.Fragment key={item.value}>
            <BreadcrumbItem>
              {item.index < items.length - 1 ? (
                <BreadcrumbLink
                  asChild
                  className="max-w-20 truncate md:max-w-none"
                >
                  <button
                    type="button"
                    onClick={() => onCrumbClick(item.index)}
                  >
                    {item.label}
                  </button>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {item.index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
