import { DocumentationRoot } from "./_base";

export function SystemSettingsDocumentation() {
  return (
    <DocumentationRoot>
      <h4>Token Validity Duration</h4>
      <p>
        By default DashPress invalidates the user&aos;s token after 14 days i.e.
        it logs the users out. So decreasing or increasing this value changes
        that invalidation duration.
      </p>
    </DocumentationRoot>
  );
}
