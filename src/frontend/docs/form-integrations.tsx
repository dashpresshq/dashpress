import { ErrorAlert, InfoAlert, RenderCode } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";
import { INTEGRATIONS_GROUP_CONFIG } from "shared/config-bag/integrations";
import { ADMIN_ACTION_INSTANCES_CRUD_CONFIG } from "frontend/views/entity/Actions/constants";
// not done
export function FormIntegrationsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        With integrations you can send notifications through email, Slack or SMS 
        or even make request to an HTTP endpoint after creating, updating or deleting
        data.
      </p>
      <p>
      The first step is the activation of the integration i.e Slack,
        Twilio, SMTP etc. except for HTTP which is always activated. Activating
        an integration is just you providing the credentials needed to run the
        integration.
      </p>
<InfoAlert message="All the activation credentials are encrypted at rest." />

      <p>
        The next step is create a <code>Form Action</code> which is basically you
      binding an integration to a data event like create, update or delete.
       </p>
       <p>These are the steps to create a form action</p>
      <ol>
        <li> Click on the <code>{ADMIN_ACTION_INSTANCES_CRUD_CONFIG.TEXT_LANG.CREATE}</code> button</li>
        <li>Select the <code>Trigger</code> i.e the event on the data you want to start this action</li>
        <li>
          Select the <code>Entity</code> or <code>Integration</code> (It is one of the other which depends on where you are triggering this form from) you want to bind to this action.
        </li>
        <li>Select the <code>Action</code> you want to take, The selections on this dropdown is a list of the 
        possible things you can do with the selected integration.
        </li>
        <li>Depending on the action selected above, You will see new fields which collects the needed information needed to run the action. Kindly fill these fields appropriately</li>
      </ol>
      <p>
        In these generated fields you will be able to use handlebars and access the following
        <ol>
          <li>
            Secrets - <code>{`{{`} {INTEGRATIONS_GROUP_CONFIG.credentials.prefix}.ENTRY{" "}{`}}`}</code>
          </li>
          <li>
          Constants - <code>{`{{`} {INTEGRATIONS_GROUP_CONFIG.constants.prefix}.ENTRY{" "}{`}}`}</code>
          </li>
          <li>
            Current Data - <code>{'{{'} data.field {'}}'}</code> 
          </li>
          <li>
            Current User - any of  
            <code> {'{{'} auth.role {'}}'} </code> 
            <code>{'{{'} auth.name {'}}'} </code> 
            <code>{'{{'} auth.username {'}}'} </code> 
            <code>{'{{'} auth.systemProfile {'}}'} </code> 
          </li>
        </ol>
        {/* <RenderCode input={``}/> */}
      </p>
      <p>
        You can always deactivate an integration by clicking on the Deactivate tab
        <ErrorAlert message="Deactivating an integration will delete its credentials and remove all its actions." />
      </p>
    </DocumentationRoot>
  );
}

