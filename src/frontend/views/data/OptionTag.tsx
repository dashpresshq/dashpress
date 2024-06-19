import { IColorableSelection } from "shared/types/ui";
import { useLingui } from "@lingui/react";
import { cn } from "@/lib/utils";
import { spectrumVariants } from "@/components/ui/spectrum";

export function OptionTag({ spectrum, label }: IColorableSelection) {
  const { _ } = useLingui();
  return (
    <div
      className={cn(
        "inline-block rounded-md py-0.5 px-2 border",
        spectrumVariants({
          spectrum,
        })
      )}
    >
      <p className="text-sm">{_(label)}</p>
    </div>
  );
}
