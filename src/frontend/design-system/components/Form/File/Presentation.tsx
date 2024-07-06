import { msg } from "@lingui/macro";
import type { DropzoneState } from "react-dropzone";
import { Upload } from "react-feather";

import { SoftButton } from "@/components/app/button/soft";
import { cn } from "@/lib/utils";

import { DELETE_BUTTON_PROPS } from "../../../../../components/app/button/constants";

// const stripes = keyframes`
// from {
// background-position: 0 0;
// }
// to {
// background-position: 60px 30px;
// }
// `;

// const Root = styled.div`
//   &:hover {
//     background-size: 30px 30px;
//     background-image: linear-gradient(
//       -45deg,
//       ${USE_ROOT_COLOR("soft-color")} 25%,
//       transparent 25%,
//       transparent 50%,
//       ${USE_ROOT_COLOR("soft-color")} 50%,
//       ${USE_ROOT_COLOR("soft-color")} 75%,
//       transparent 75%,
//       transparent
//     );
//     animation: ${stripes} 2s linear infinite;
//   }

//   &.invalid {
//     border-color: ${SYSTEM_COLORS.danger};
//   }

//   &.disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//     text-decoration: line-through;

//     &:hover {
//       background-image: none;
//       animation: none;
//     }
//   }
// `;

export interface IProps {
  isSubmitting: boolean;
  disabled?: boolean;
  value: string;
  error: string;
  formClassName: string;
  onClear: () => void;
  dropZoneProps: DropzoneState;
}

export function Presentation({
  isSubmitting,
  disabled,
  value,
  error,
  formClassName,
  onClear,
  dropZoneProps,
}: IProps) {
  return (
    // background-image: none;
    // transition: border-color 0.15s linear;
    <div
      className={cn(
        "h-48 w-full max-w-full cursor-pointer overflow-hidden rounded-md border border-dashed border-border bg-base text-main",
        {
          disabled,
          [formClassName]: true,
        }
      )}
      {...dropZoneProps.getRootProps()}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <Upload size={40} className="text-primary" />
        <p className="mb-3">
          {/* eslint-disable-next-line no-nested-ternary */}
          {isSubmitting
            ? "Uploading..."
            : value
            ? "Drag and drop or click to replace"
            : "Drag and drop a file here, or click to select file"}
        </p>
        {value && (
          <p className="text-sm text-muted">
            {value}{" "}
            {!disabled ? (
              <SoftButton
                size="icon"
                {...DELETE_BUTTON_PROPS({
                  action: onClear,
                  isMakingRequest: false,
                  label: msg`Remove`,
                  shouldConfirmAlert: undefined,
                })}
              />
            ) : null}
          </p>
        )}
        {error && <p className="font-semibold text-red-600">{error}</p>}
      </div>
      <input
        type="file"
        className="absolute inset-0 z-[5] size-full cursor-pointer opacity-0"
        {...dropZoneProps.getInputProps()}
      />
    </div>
  );
}
