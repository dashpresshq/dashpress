import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { makeFileRequest } from "frontend/lib/data/makeRequest";
import { ISharedFormInput } from "../_types";
import { generateClassNames, wrapLabelAndError } from "../_wrapForm";
import { Presentation } from "./Presentation";

interface IFormFileInput extends ISharedFormInput {
  uploadUrl: string;
  metadata?: Record<string, unknown>;
}

function FileInput({
  input,
  meta,
  disabled,
  uploadUrl,
  metadata,
}: IFormFileInput) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          Object.entries(metadata).forEach(([key, keyValue]) => {
            formData.append(key, keyValue as string);
          });
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
        setIsSubmitting(false);
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
    <Presentation
      {...{ isSubmitting, disabled, value, error }}
      onClear={() => onChange(null)}
      dropZoneProps={dropZoneProps}
      formClassName={generateClassNames(meta)}
    />
  );
}

export const FormFileInput: React.FC<IFormFileInput> = (formInput) => {
  return wrapLabelAndError(<FileInput {...formInput} />, formInput);
};

// https://react-dropzone.js.org/#section-styling-dropzone
