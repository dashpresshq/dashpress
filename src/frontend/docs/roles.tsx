import { InfoAlert, Spacer } from "@hadmean/chromista";
import { USER_PERMISSIONS } from "shared/constants/user";
import { userFriendlyCase } from "shared/lib/strings";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";
// done
export function RolesDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Hadmean as two default roles which are not editable or deletable and
        they are <code>Creator</code> and <code>Viewer</code>.
      </p>

      <h4> Creator</h4>
      <p>
        This is the can-do-all things role, which is the role the users
        installing the application gets assigned. We basically skip any
        permission checks when a user has this role
      </p>

      <h4>Viewer</h4>
      <p>
        This role has only <code>Can Manage All Entities</code> which means the
        user can only view and manage all enabled data but can&apos;t perform
        another app actions like configuring the app, managing users, managing
        roles, reset passwords etc.
      </p>

      <h4>Custom roles</h4>
      <p>
        You can create as many roles as you want and assign any permissions to
        them.
      </p>

      <InfoAlert message="When a custom role is deleted then all the users belonging to that role will be assigned the Viewer role" />
      <Spacer />

      <h4>Permissions Breakdown </h4>
      <p>
        <b>
          <code>{userFriendlyCase(USER_PERMISSIONS.CAN_CONFIGURE_APP)}</code>
        </b>
        : enables users to configure the app i.e setting the configurations,
        look and feel of the application. This is the role you will want to
        assign to the most technical people on the team
      </p>

      <p>
        <b>
          <code>
            {userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES)}
          </code>
        </b>
        : enables users access to all entities.
      </p>

      <p>
        <b>
          <code>{userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_DASHBOARD)}</code>
        </b>
        : enables users to build and manage the dashboard.
      </p>

      <p>
        <b>
          <code>
            {userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS)}
          </code>
        </b>
        : enables users to setup and manage the integrations with supported
        third party APIs like Slack, Email, HTTP etc.
      </p>

      <p>
        <b>
          <code>
            {userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_PERMISSIONS)}
          </code>
        </b>
        : enables users to manage roles and permissions.
      </p>

      <p>
        <b>
          <code>{userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_USERS)}</code>
        </b>
        : enables users to list, create, update and delete users.
      </p>

      <p>
        <b>
          <code>{userFriendlyCase(USER_PERMISSIONS.CAN_RESET_PASSWORD)}</code>
        </b>
        : enables users to reset passwords.
      </p>

      <h4>Permissions Dependencies </h4>
      <p>
        Enabling some permission will automatically grant some other permission.
        Like for example Giving someone the permission to reset password without
        giving them the permission to manage users doesn&pos;t make sense as
        they need to be able to access users first to get to where they will be
        able to reset the password. This is what we call permissions
        dependencies.
      </p>
      <p>
        These are the permission dependencies.
        <ul>
          <li>
            <code>{userFriendlyCase(USER_PERMISSIONS.CAN_RESET_PASSWORD)}</code>{" "}
            - <code>{userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_USERS)}</code>
          </li>
          <li>
            <code>
              {userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS)}
            </code>{" "}
            -{" "}
            <code>{userFriendlyCase(USER_PERMISSIONS.CAN_CONFIGURE_APP)}</code>
          </li>
          <li>
            <code>{userFriendlyCase(USER_PERMISSIONS.CAN_CONFIGURE_APP)}</code>{" "}
            -{" "}
            <code>
              {userFriendlyCase(USER_PERMISSIONS.CAN_MANAGE_ALL_ENTITIES)}
            </code>
          </li>
        </ul>
      </p>
    </DocumentationRoot>
  );
}
