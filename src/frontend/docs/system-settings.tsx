import { InfoAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function SystemSettingsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <h4>Token Validity Duration</h4>
      <p>
        Set the number of days you want your authentication token to be valid.
        The default value is `14`.
      </p>

      <h4>Force Introspection</h4>
      <p>
        We introspect your database every time the application runs. This
        behavior is good for most production use cases as you want your schema
        to be up to date whenever you run the application.
      </p>

      <InfoAlert message="This setting is not respected when your schema is empty so we will always introspect when running for the first time or if you delete your schema for any reason." />
    </DocumentationRoot>
  );
}
