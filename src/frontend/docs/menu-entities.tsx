import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function MenuEntitiesDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Here you will be able to select the entities that will be shown on the
        entities menu sidebar. You can also reorder them on the{" "}
        <code>Order</code> to control how they appear on the sidebar.
      </p>
    </DocumentationRoot>
  );
}
