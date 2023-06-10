import { DocumentationRoot, IDocumentationRootProps } from "../_base";

export function PresentationScriptDocumentation(
  props: IDocumentationRootProps
) {
  return (
    <DocumentationRoot {...props}>
      TODO notify that an error will fail silently as the original value will be
      used
    </DocumentationRoot>
  );
}
