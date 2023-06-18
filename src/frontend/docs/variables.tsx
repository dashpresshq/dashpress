import { userFriendlyCase } from "shared/lib/strings";
import { USER_PERMISSIONS } from "shared/constants/user";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function VariablesDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Variables are what you use to store values for later use. We have two
        types of variables each with different use cases
      </p>
      <h4>1. Constants</h4>
      <p>
        Constants are what you use to store values that you use often when doing
        integrations.
      </p>
      <p>
        You can store your
        <ul>
          <li>Company details like, name, address, logo link, website etc</li>
          <li>Slack channel IDs</li>
          <li>Sender address for automated mails</li>
          <li>Base URL for an HTTP endpoint</li>
        </ul>
      </p>
      <p>
        Basically when you find your self copying and pasting a value a lot
        during integrations then it is probably a good idea to store it as a
        variable.
      </p>

      <p>
        Any other good reason to use constants is to have a central place to
        manage them. For example if you paste your company address everywhere
        and later the address changes, then you will have to manually go to all
        those places and update them compared to just needing to update once and
        having it reflected everywhere
      </p>

      <p>
        Constants can be managed and viewed by anybody that has the
        <code>
          {" "}
          {userFriendlyCase(USER_PERMISSIONS.CAN_CONFIGURE_APP)}
        </code>{" "}
        permission.
      </p>

      <h4>2. Secrets</h4>
      <p>
        Secrets are sensitive values you don&apos;t want exposed in the case of
        a breach, things like passwords, access tokens, private keys etc.
      </p>
      <p>
        The primary difference between secrets and variables is that secrets are
        encrypted at rest using
        <code> aes-256-gcm</code> and variables are not, meaning anybody that
        gets access to the secrets will not be able to use them elsewhere as
        they will gibberish whereas constants are stored in plaintext and can be
        copied.
      </p>
      <p>
        This doesn&pos;t mean everything should be stored as a secret as secrets
        requires some computation to use which consumes some server resource,
        constants are perfect to store public values like company name, company
        logo link etc.
      </p>
      <p>
        Secrets can be view by users that have the{" "}
        <code> {userFriendlyCase(USER_PERMISSIONS.CAN_CONFIGURE_APP)}</code> or
        <code>
          {" "}
          {userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS)}{" "}
        </code>{" "}
        permission but can only be manage by users with the
        <code>
          {" "}
          {userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS)}
        </code>{" "}
        permission.
      </p>
    </DocumentationRoot>
  );
}
