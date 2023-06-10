import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function VariablesDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Variables are the way you store things that you use often when doing
        integrations. Since they are key-value pairs, you can pretty much store
        anything in them and as much as you want.
      </p>
      <p>
        You can store your company name so that you don&apos;t repeat them too
        often in your email templates.
      </p>
      <p>
        You can store your most used Slack channel ID, company address, link to
        your company logo, your preferred email sender&apos;s address etc.
      </p>

      <p>
        Basically, if you find that you are using repeating a value too much
        during integrations then it is probably a good idea to store it as a
        variable.
      </p>

      <p>
        Any other good reason to use variables often is to have a central place
        to manage them. Say you store your company address as a variable and you
        then change your company address, then you will just need to update once
        in the Variables UI rather than combing through all the usages and
        trying to update them manually.
      </p>

      <p>There are two types of Variables.</p>

      <h4>Constants</h4>
      <p>
        Here you store public values. Like your company name, company address
        etc.
      </p>

      <p>
        They can be managed and viewed by anybody that has the
        `CAN_CONFIGURE_APP` permission.
      </p>

      <h4>Secrets</h4>
      <p>
        These are values you will keep or are asked to keep in a `.env` file
        usually tokens or private keys.
      </p>
      <p>
        All secrets provided in the application are encrypted at rest using
        `aes-256-gcm`.
      </p>
      <p>
        The list can be view by users that have the `CAN_CONFIGURE_APP` or
        `CAN_MANAGE_ACTIONS` permission but can only be manage by users with the
        `CAN_MANAGE_ACTIONS` permission.
      </p>
    </DocumentationRoot>
  );
}
