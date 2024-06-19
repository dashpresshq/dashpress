import { ChevronsDown, Icon, ChevronsUp } from "react-feather";
import { SystemIconsKeys } from "shared/constants/Icons";
import { cn } from "@/lib/utils";
import { SpectrumColorTypes, spectrumVariants } from "@/components/ui/spectrum";
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

export function SummaryWidget({
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
    <div className="flex gap-4 items-center">
      <SystemIcon
        icon={icon as SystemIconsKeys}
        className={cn(
          "w-10 h-10 min-w-10 rounded-full p-2",
          spectrumVariants({
            spectrum: color,
          })
        )}
        label={`${title} Icon`}
      />
      <div className="w-full pt-1">
        <div className="flex justify-between items-end">
          <p className="font-semibold text-xl" aria-label="Total Count">
            {fullCount}
          </p>
          {relativeCount ? (
            <div
              className={cn(
                "flex gap-0.5 w-auto items-center border rounded-lg px-1",
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
                  className={cn("text-main align-sub", {
                    "text-green-600": direction === "up",
                    "text-red-600": direction === "down",
                  })}
                />
              </span>

              <p
                className={cn("font-semibold text-xs leading-5 text-main", {
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
