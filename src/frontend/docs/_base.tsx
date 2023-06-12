import { ReactNode } from "react";
import { OffCanvas } from "@hadmean/chromista";
import styled from "styled-components";

export interface IDocumentationRootProps {
  isOpen: boolean;
  title: string;
  close: (value: false) => void;
}

const Root = styled.div`
  margin-top: -8px;

  h4 {
    margin-bottom: -8px !important;
  }

  p {
    margin: 12px 0;
    font-size: 16px !important;
  }

  code {
    font-style: italic;
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
