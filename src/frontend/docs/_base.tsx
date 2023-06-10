import { ReactNode } from "react";
import { OffCanvas } from "@hadmean/chromista";

export interface IDocumentationRootProps {
  isOpen: boolean;
  title: string;
  close: (value: false) => void;
}

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
      {children}
    </OffCanvas>
  );
}
