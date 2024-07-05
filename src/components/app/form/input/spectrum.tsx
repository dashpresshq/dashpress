import { Check } from "react-feather";
import { Button } from "@/components/ui/button";
import { SPECTRUM_COLORS, spectrumVariants } from "@/components/ui/spectrum";
import { cn } from "@/lib/utils";
import { LabelAndError } from "./label-and-error";
import type { ILabelAndErrorProps } from "./types";

export function SpectrumColorInputField({
  formInput,
}: {
  formInput: ILabelAndErrorProps;
}) {
  return (
    <LabelAndError formInput={formInput}>
      <div className="flex gap-3">
        {SPECTRUM_COLORS.map((spectrum) => (
          <Button
            key={spectrum}
            variant="ghost"
            className={cn(
              "mb-0 flex size-8 cursor-pointer items-center justify-center rounded-full border-4 p-0 text-center outline-none",
              spectrumVariants({
                spectrum,
              })
            )}
            type="button"
            onClick={() => formInput.input.onChange(spectrum)}
          >
            {spectrum === formInput.input.value && (
              <Check size="18" strokeWidth={5} />
            )}
          </Button>
        ))}
      </div>
    </LabelAndError>
  );
}
