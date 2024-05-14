import { OffCanvas } from "frontend/design-system/components/OffCanvas";
import { ReactNode } from "react";
import styled from "styled-components";
import { msg } from "@lingui/macro";
import { useDocumentationCanvasStore } from "./constants";

const Root = styled.div`
  margin-top: -8px;

  h4,
  h5 {
    margin-bottom: -8px !important;
  }

  h5 {
    font-size: 15px;
  }

  p {
    font-size: 0.875rem;
    margin: 12px 0;
  }

  code {
    font-style: italic;
  }

  pre {
    min-height: initial;
  }

  ul,
  ol {
    margin-top: 0px;
    padding-left: 24px;
  }
`;

export function DocumentationRoot({ children }: { children: ReactNode }) {
  const canvasStore = useDocumentationCanvasStore();
  return (
    <OffCanvas
      title={msg`${canvasStore.title}`}
      onClose={() => canvasStore.setTitle("")}
      show={!!canvasStore.title}
      width={600}
    >
      <Root>{children}</Root>
    </OffCanvas>
  );
}
