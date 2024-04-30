import { DocumentationRoot } from "./_base";

export function DictionDocumentation() {
  return (
    <DocumentationRoot>
      <p>
        Say an entity is labeled <code>faqs</code> in the database and shows as{" "}
        <code>Faqs</code> in the UI but you want it to be labeled{" "}
        <code>Frequently Asked Questions</code> on the app for plural form and
        just <code>Question</code> for singular form, You can achieve this by
        saving this form with these values, and your desired entity diction will
        be reflected everywhere this entity is being shown on the app.
      </p>
    </DocumentationRoot>
  );
}
