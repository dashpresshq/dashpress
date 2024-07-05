import type { IColorableSelection } from "shared/types/ui";
import { useLingui } from "@lingui/react";
import { cn } from "@/lib/utils";
import { spectrumVariants } from "@/components/ui/spectrum";

export function OptionTag({ spectrum, label }: IColorableSelection) {
  const { _ } = useLingui();
  return (
    <div
      className={cn(
        "inline-block rounded-md border px-2 py-0.5",
        spectrumVariants({
          spectrum,
        })
      )}
    >
      <p className="text-sm">{_(label)}</p>
    </div>
  );
}
