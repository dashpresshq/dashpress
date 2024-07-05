import type { Icon } from "react-feather";
import { ChevronsDown, ChevronsUp } from "react-feather";
import type { SystemIconsKeys } from "shared/constants/Icons";
import { cn } from "@/lib/utils";
import type { SpectrumColorTypes } from "@/components/ui/spectrum";
import { spectrumVariants } from "@/components/ui/spectrum";
import { SystemIcon } from "@/components/app/system-icons";

const DirectionImplementation: Record<
  "up" | "down" | "side",
  {
    label: string;
    Icon: Icon;
  }
> = {
  down: {
    Icon: ChevronsDown,
    label: "Down",
  },
  up: {
    Icon: ChevronsUp,
    label: "Up",
  },
  side: {
    Icon: () => null,
    label: "Side",
  },
};

export interface IProps {
  title: string;
  color: SpectrumColorTypes;
  fullCount: string;
  relativeCount: string;
  icon: string;
  direction: "up" | "down" | "side";
}

export function SummaryWidgetPresentation({
  color,
  fullCount,
  relativeCount,
  title,
  direction,
  icon,
}: IProps) {
  const { Icon: DirectionIcon, label: directionLabel } =
    DirectionImplementation[direction];

  return (
    <div className="flex items-center gap-4">
      <SystemIcon
        icon={icon as SystemIconsKeys}
        className={cn(
          "size-10 min-w-10 rounded-full p-2",
          spectrumVariants({
            spectrum: color,
          })
        )}
        label={`${title} Icon`}
      />
      <div className="w-full pt-1">
        <div className="flex items-end justify-between">
          <p className="text-xl font-semibold" aria-label="Total Count">
            {fullCount}
          </p>
          {relativeCount ? (
            <div
              className={cn(
                "flex w-auto items-center gap-0.5 rounded-lg border px-1",
                spectrumVariants({
                  spectrum:
                    // eslint-disable-next-line no-nested-ternary
                    direction === "up"
                      ? "green"
                      : direction === "down"
                      ? "red"
                      : "gray",
                })
              )}
              aria-label="Relative Direction"
            >
              <span aria-label={directionLabel}>
                <DirectionIcon
                  size={20}
                  className={cn("align-sub", {
                    "text-green-600": direction === "up",
                    "text-red-600": direction === "down",
                  })}
                />
              </span>

              <p
                className={cn("text-xs font-semibold leading-5", {
                  "text-green-600": direction === "up",
                  "text-red-600": direction === "down",
                })}
                aria-label="Relative Count"
              >
                {relativeCount}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
