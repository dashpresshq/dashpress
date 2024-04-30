import { DocumentationRoot } from "./_base";

export function EnabledEntitiesDocumentation() {
  return (
    <DocumentationRoot>
      <p>
        Disabling an entity here means it will not be a part of this
        application. It will be like it doesn&apos;t exist. Disabled entities
        will not show anywhere on the application and any request made to it
        will result in a 404 response.
      </p>
      <p>
        This is a good place to toggle off entities in the database that
        don&apos;t have much business value, for example, migrations, logs, etc.
      </p>
    </DocumentationRoot>
  );
}
