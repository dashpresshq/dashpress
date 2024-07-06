import { useLingui } from "@lingui/react";
import type { IColorableSelection } from "shared/types/ui";

import { spectrumVariants } from "@/components/ui/spectrum";
import { cn } from "@/lib/utils";

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
