import { UserPermissions } from "shared/constants/user";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";

import { DocumentationRoot } from "./_base";

export function VariablesDocumentation() {
  return (
    <DocumentationRoot>
      <p>
        Variables are what you use to store values for later use. We have two
        types of variables each with different use cases.
      </p>
      <h4>1. Constants</h4>
      <p>
        Constants are what you use to store values that you use often when doing
        integrations.
      </p>
      <p>
        You can store your
        <ul>
          <li>Company details like name, address, logo link, website, etc.</li>
          <li>Slack channel IDs.</li>
          <li>Sender address for automated emails.</li>
          <li>Base URL for an HTTP endpoint.</li>
        </ul>
      </p>
      <p>
        Basically, when you find yourself copying and pasting a value a lot
        during integrations then it is probably a good idea to store it as a
        variable.
      </p>

      <p>
        Another good reason to use constants is to have a central place to
        manage them. For example, if you paste your company address everywhere
        and later the address changes, then you will have to manually go to all
        those places and update them compared to just updating once and having
        it reflected everywhere.
      </p>

      <p>
        Constants can be managed and viewed by anybody that has the
        <code> {userFriendlyCase(UserPermissions.CAN_CONFIGURE_APP)}</code>{" "}
        permission.
      </p>

      <h4>2. Secrets</h4>
      <p>
        Secrets are sensitive values you don&apos;t want to be exposed in the
        case of a breach. Things like passwords, access tokens, private keys,
        etc. are secrets.
      </p>
      <p>
        The primary difference between secrets and variables is that secrets are
        encrypted at rest using <code>aes-256-gcm</code> and variables are not.
        Meaning anybody that gets access to the secrets will not be able to use
        them elsewhere as they will be gibberish whereas constants are stored in
        plaintext and can be copied.
      </p>
      <p>
        This doesn&apos;t mean everything should be stored as a secret as
        secrets require some computation to use which consumes significant
        server resources. Whereas, constants are perfect to store public values
        like company name, company logo link, etc.
      </p>
      <p>
        Secrets can be viewed by users that have the{" "}
        <code> {userFriendlyCase(UserPermissions.CAN_CONFIGURE_APP)}</code> or
        <code>
          {" "}
          {userFriendlyCase(UserPermissions.CAN_MANAGE_APP_CREDENTIALS)}{" "}
        </code>{" "}
        permission but can only be managed by users with the
        <code>
          {" "}
          {userFriendlyCase(UserPermissions.CAN_MANAGE_APP_CREDENTIALS)}
        </code>{" "}
        permission.
      </p>
    </DocumentationRoot>
  );
}
