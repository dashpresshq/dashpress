import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { makeFileRequest } from "frontend/lib/data/makeRequest";
import { useToggle } from "frontend/hooks/state/useToggleState";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { ISharedFormInput } from "../../../../../components/app/form/input/types";
import { Presentation } from "./Presentation";
import {
  LabelAndError,
  generateClassNames,
} from "@/components/app/form/input/label-and-error";

interface IFormFileInput extends ISharedFormInput {
  uploadUrl: string;
  metadata?: Record<string, unknown>;
}

export function FormFileInput({
  input,
  meta,
  disabled,
  uploadUrl,
  metadata,
}: IFormFileInput) {
  const submissionMode = useToggle();
  const [error, setError] = useState<string>("");
  const { value, onChange } = input;
  // Get the fiel settings
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      input.onChange(null);
      acceptedFiles.forEach(async (file) => {
        const formData = new FormData();
        formData.append("file", file, file.name);

        if (metadata) {
          typescriptSafeObjectDotEntries(metadata).forEach(
            ([key, keyValue]) => {
              formData.append(key, keyValue as string);
            }
          );
        }
        try {
          const { fileUrl } = await makeFileRequest(uploadUrl, formData);
          input.onChange(fileUrl);
          setError(null);
        } catch (e) {
          setError(
            e.response.data.message || "Ooops, something wrong happened."
          );
        }
        submissionMode.off();
      });
    },
    [uploadUrl, input, metadata]
  );
  const dropZoneProps = useDropzone({
    onDrop,
    multiple: false,
    // accept: { image: ["jpeg, png"] },
    // maxSize,
    disabled,
  });

  return (
    <LabelAndError formInput={{ input, meta }}>
      <Presentation
        {...{ isSubmitting: submissionMode.isOn, disabled, value, error }}
        onClear={() => onChange(null)}
        dropZoneProps={dropZoneProps}
        formClassName={generateClassNames(meta)}
      />
    </LabelAndError>
  );
}

// https://react-dropzone.js.org/#section-styling-dropzone
