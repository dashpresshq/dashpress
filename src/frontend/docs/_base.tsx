import { CSSProperties, ReactNode } from "react";
import { msg } from "@lingui/macro";
import { useDocumentationCanvasStore } from "./constants";
import { OffCanvas } from "@/components/app/off-canvas";

export function DocumentationRoot({ children }: { children: ReactNode }) {
  const canvasStore = useDocumentationCanvasStore();
  return (
    <OffCanvas
      title={msg`${canvasStore.title}`}
      onClose={() => canvasStore.setTitle("")}
      show={!!canvasStore.title}
      size="lg"
    >
      <div
        style={
          {
            "--tw-prose-code": "hsl(var(--dp-main))",
            "--tw-prose-headings": "hsl(var(--dp-main))",
          } as CSSProperties
        }
        className="prose !text-main [&_pre]:!m-0"
      >
        {children}
      </div>
    </OffCanvas>
  );
}
