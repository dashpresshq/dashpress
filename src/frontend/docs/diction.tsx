import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function DictionDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Diction allows you to customize how an entity will be displayed on the
        application by providing the appropriate values for the singular and
        plural forms
      </p>
      <p>
        For example, say an entity is labeled <code>Faqs</code> in the database
        and shows as <code>Faqs</code> in the UI but you want it to be labelled{" "}
        <code>Frequently Asked Questions</code> on the app, setting this desired
        name on this form with the <code>Plural</code> field will enable that.
      </p>
      <p>
        Since the convention for table names is to use the plural form, then
        filling the <code>Singular</code> field allows you to specify the
        singular name for the entity.
      </p>
    </DocumentationRoot>
  );
}
