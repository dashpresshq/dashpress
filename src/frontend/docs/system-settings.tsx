import { Spacer } from "frontend/design-system/primitives/Spacer";
import { InfoAlert } from "frontend/design-system/components/Alert";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function SystemSettingsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <Spacer />
      <h4>Token Validity Duration</h4>
      <p>
        By default DashPress invalidates the user&aos;s token after 14 days i.e.
        it logs the users out. So decreasing or increasing this value changes
        that invalidation duration.
      </p>

      <InfoAlert message="This setting is not respected when your schema is empty so we will always introspect when running for the first time or if you delete the saved schema for any reason." />
    </DocumentationRoot>
  );
}
