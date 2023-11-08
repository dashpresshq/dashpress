import React from "react";
import classnames from "classnames";
import styled, { keyframes } from "styled-components";
import { Upload } from "react-feather";
import { DropzoneState } from "react-dropzone";
import { USE_ROOT_COLOR } from "frontend/design-system/theme/root";
import { SYSTEM_COLORS } from "frontend/design-system/theme/system";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Typo } from "frontend/design-system/primitives/Typo";
import { ProgressBar } from "frontend/design-system/components/ProgressBar";
import { DeleteButton } from "frontend/design-system/components/Button/DeleteButton";

const FileInput = styled.input`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 5;
`;

const stripes = keyframes`
from {
background-position: 0 0;
}
to {
background-position: 60px 30px;
}
`;

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  height: 200px;
  position: relative;
  color: ${USE_ROOT_COLOR("main-text")};
  background-image: none;
  text-align: center;
  transition: border-color 0.15s linear;
  background-color: ${USE_ROOT_COLOR("base-color")};
  border: 1px dashed ${USE_ROOT_COLOR("border-color")};

  &:hover {
    background-size: 30px 30px;
    background-image: linear-gradient(
      -45deg,
      ${USE_ROOT_COLOR("soft-color")} 25%,
      transparent 25%,
      transparent 50%,
      ${USE_ROOT_COLOR("soft-color")} 50%,
      ${USE_ROOT_COLOR("soft-color")} 75%,
      transparent 75%,
      transparent
    );
    animation: ${stripes} 2s linear infinite;
  }

  &.invalid {
    border-color: ${SYSTEM_COLORS.danger};
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    text-decoration: line-through;

    &:hover {
      background-image: none;
      animation: none;
    }
  }
`;

const ProgressRoot = styled.div`
  position: absolute;
  width: 100%;
  top: 5px;
`;

export interface IProps {
  progress: number;
  disabled?: boolean;
  value: string;
  error: string;
  formClassName: string;
  onClear: () => void;
  dropZoneProps: DropzoneState;
}

export function Presentation({
  progress,
  disabled,
  value,
  error,
  formClassName,
  onClear,
  dropZoneProps,
}: IProps) {
  return (
    <Root
      className={classnames({
        disabled,
        [formClassName]: true,
      })}
      {...dropZoneProps.getRootProps()}
    >
      {progress > 0 && (
        <ProgressRoot>
          <ProgressBar progress={progress} />
        </ProgressRoot>
      )}
      <div>
        <Upload size={40} color={USE_ROOT_COLOR("primary-color")} />
        <Typo.MD>
          {value
            ? "Drag and drop or click to replace"
            : "Drag and drop a file here, or click to select file"}
        </Typo.MD>
        <Spacer />
        {value && (
          <Typo.SM color="muted">
            {value}{" "}
            {!disabled ? (
              <DeleteButton
                onDelete={onClear}
                shouldConfirmAlert={false}
                size="xs"
              />
            ) : null}
          </Typo.SM>
        )}
        {error && (
          <Typo.MD color="danger" weight="bold">
            {error}
          </Typo.MD>
        )}
      </div>
      <FileInput type="file" {...dropZoneProps.getInputProps()} />
    </Root>
  );
}
