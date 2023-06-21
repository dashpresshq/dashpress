import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function MenuEntitiesDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Here you will be able to select the entities that will be shown on the
        sidebar. You can also reorder them on the <code>Order</code> tab and
        that order will be used to present.
      </p>
    </DocumentationRoot>
  );
}
