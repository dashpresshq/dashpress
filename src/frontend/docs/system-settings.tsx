import { InfoAlert, Spacer } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function SystemSettingsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <Spacer />
      <h4>Token Validity Duration</h4>
      <p>
        By default Hadmean invalidates the user&aos;s token after 14 days i.e.
        it logs the users out. So decreasing or increasing this value changes
        that invalidation duration.
      </p>

      <h4>Force Introspection</h4>
      <p>
        We introspect your database every time the application runs and save the
        schema. This behavior is good for 99% of production use cases as you
        want the schema to be up to date whenever you run the application so
        that Hadmean shows you the latest database changes. In case you do not
        want your schema up to date for any reason then you can always toggle
        this off here.
      </p>

      <InfoAlert message="This setting is not respected when your schema is empty so we will always introspect when running for the first time or if you delete the saved schema for any reason." />
    </DocumentationRoot>
  );
}
