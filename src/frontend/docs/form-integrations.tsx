import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function FormIntegrationsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        After submitting some forms, we may want to perform some action usually
        sending notifications through email, Slack or SMS. Sometimes we might
        even want to send the data just created to an HTTP endpoint to do
        further processing. Form integration is how you achieve that.
      </p>
      <p>
        Form integrations start with you activating the action i.e Slack,
        Twilio, SMTP etc. except for HTTP which is always activated. Activating
        an action is as simple as providing the credentials needed to run the
        action usually a token or an account ID. Note that all the inputs for
        this form are encrypted at rest.
      </p>

      <p>The form integration will ask you for the </p>
      <ol>
        <li>Trigger i.e when you want to run the action</li>
        <li>
          The Entity/Integration you want to use based on where you are filling
          the form from,
        </li>
        <li>The Action from the selected Integration you want to run</li>
        <li>The action selected creates the fields needed to run the action</li>
      </ol>
      <p>
        {`
        In the form integrations, you will have access to all your secrets,
        "{{SECRETS.PRIVATE }}" and constants
        "{{CONSTANTS.EXAMPLE }}" and also the
        current data like this "{{data.myEntityField
        }}".
        You can also access the current user properties with any of {{ auth.role }}, {{ auth.name }}, {{ auth.username }} and {{ auth.systemProfile }}
        All these are handlebars that you can use anywhere in
        the form.
        `}
      </p>
      <p>
        You can always deactivate an action by clicking on the Deactivate tab
        and typing the requested input. Deactivating an action will delete the
        Action secrets and remove all its instances.
      </p>
    </DocumentationRoot>
  );
}
// import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
// {`{{`} {INTEGRATIONS_GROUP_CONFIG.credentials.prefix}.ENTRY{" "}
//           {`}}`}
