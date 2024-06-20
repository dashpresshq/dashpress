import { ReactNode } from "react";
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
      <div className="[&_ul]:pl-6 [&_ol]:pl-6 [&_ul]:list-disc [&_ol]:list-decimal [&_p]:mb-2 [&_li]:mb-2 [&_code]:italic [&_h5]:font-semibold [&_h4]:font-semibold [&_h5]:text-sm [&_p]:text-sm [&_li]:text-sm">
        {children}
      </div>
    </OffCanvas>
  );
}
