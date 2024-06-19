import { useLingui } from "@lingui/react";
import Link from "next/link";
import { Loader } from "react-feather";
import { VariantProps } from "class-variance-authority";
import { Card } from "@/components/ui/card";
import { CommandItem, Command, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { useConfirmAlert } from "./confirm-alert";
import { IMenuActionItem } from "./button/types";
import { SystemIcon } from "./system-icons";

export interface IProps {
  menuItems: IMenuActionItem[];
  currentMenuItem?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
}

export function MenuSection({
  menuItems,
  currentMenuItem,
  size = "lg",
}: IProps) {
  const { _ } = useLingui();

  const confirmAlert = useConfirmAlert();

  const orderedMenuItems = menuItems.sort((a, b) => {
    const aOrder = a.order ?? 10;
    const bOrder = b.order ?? 10;

    return aOrder - bOrder;
  });

  return (
    <Card className="p-1">
      <Command>
        <CommandList className="max-h-full">
          <div className="flex flex-col gap-1">
            {orderedMenuItems.map(
              ({
                label,
                action,
                systemIcon,
                subtle,
                id,
                variant = "ghost",
                destructive,
                disabled,
                isMakingRequest,
                shouldConfirmAlert,
              }) => {
                const active = (
                  typeof action === "string" ? action : ""
                ).includes(currentMenuItem);

                const content = (
                  <>
                    {isMakingRequest ? (
                      <Loader className="animate-spin w-4 h-4" />
                    ) : (
                      <SystemIcon
                        className={cn("mr-2 h-4 w-4 text-main", {
                          "text-primary-text": active,
                          "text-muted": subtle || disabled,
                          "text-red-600": destructive,
                        })}
                        icon={systemIcon}
                      />
                    )}
                    {_(label)}
                  </>
                );

                return (
                  <CommandItem
                    asChild
                    className={cn(
                      buttonVariants({ variant, size }),
                      "text-main hover:text-main hover:cursor-pointer rounded-md hover:bg-hover justify-start",
                      {
                        "!bg-primary !text-primary-text": active,
                        "text-muted hover:text-muted": subtle || disabled,
                        "text-red-600 hover:text-red-600 hover:bg-red-100":
                          destructive,
                      }
                    )}
                    key={id}
                    disabled={disabled}
                  >
                    {typeof action === "string" ? (
                      <Link
                        href={action}
                        target={
                          action.startsWith("http") ? "_blank" : undefined
                        }
                      >
                        {content}
                      </Link>
                    ) : (
                      <Button
                        onClick={() => {
                          if (shouldConfirmAlert) {
                            return confirmAlert({
                              title: shouldConfirmAlert,
                              action,
                            });
                          }
                          action();
                        }}
                        variant={variant}
                        size={size}
                        type="button"
                      >
                        {content}
                      </Button>
                    )}
                  </CommandItem>
                );
              }
            )}
          </div>
        </CommandList>
      </Command>
    </Card>
  );
}
