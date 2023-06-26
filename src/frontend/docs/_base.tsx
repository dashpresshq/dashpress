import { OffCanvas } from "frontend/design-system/components/OffCanvas";
import { ReactNode } from "react";
import styled from "styled-components";

export interface IDocumentationRootProps {
  isOpen: boolean;
  title: string;
  close: (value: false) => void;
}

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
    margin: 12px 0;
    font-size: 16px !important;
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

export function DocumentationRoot({
  close,
  isOpen,
  children,
  title,
}: IDocumentationRootProps & {
  children: ReactNode;
}) {
  return (
    <OffCanvas
      title={title}
      onClose={() => close(false)}
      show={isOpen}
      width={600}
    >
      <Root>{children}</Root>
    </OffCanvas>
  );
}
