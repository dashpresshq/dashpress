import { ReactNode } from "react";
import styled from "styled-components";
import { msg } from "@lingui/macro";
import { useDocumentationCanvasStore } from "./constants";
import { OffCanvas } from "@/components/app/off-canvas";

const Root = styled.div`
  h4,
  h5 {
    margin-bottom: -8px !important;
  }

  h5 {
    font-size: 15px;
  }

  p,
  li {
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
    list-style-type: disc;
  }
`;

export function DocumentationRoot({ children }: { children: ReactNode }) {
  const canvasStore = useDocumentationCanvasStore();
  return (
    <OffCanvas
      title={msg`${canvasStore.title}`}
      onClose={() => canvasStore.setTitle("")}
      show={!!canvasStore.title}
      size="lg"
    >
      <Root>{children}</Root>
    </OffCanvas>
  );
}
