import { UserPermissions } from "shared/constants/user";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { InfoAlert } from "@/components/app/alert";
import { DocumentationRoot } from "./_base";

export function RolesDocumentation() {
  return (
    <DocumentationRoot>
      <p>
        DashPress has two default roles which are not editable or deletable and
        they are <code>Creator</code> and <code>Viewer</code>.
      </p>

      <h4> Creator</h4>
      <p>
        This is the can-do-all things role, which is the role the users
        installing the application get assigned. We basically skip any
        permission checks when a user has this role.
      </p>

      <h4>Viewer</h4>
      <p>
        This role has only <code>Can Manage All Entities</code> which means the
        user can only view and manage all enabled data but can&apos;t perform
        other app actions like configuring the app, managing users, managing
        roles, resetting passwords, etc.
      </p>

      <h4>Custom roles</h4>
      <p>
        You can create as many roles as you want and assign any permissions to
        them.
      </p>

      <InfoAlert message="When a custom role is deleted then all the users belonging to that role will be assigned the Viewer role" />

      <h4>Permissions Breakdown </h4>
      <p>
        <b>
          <code>{userFriendlyCase(UserPermissions.CAN_CONFIGURE_APP)}</code>
        </b>
        : enables users to configure the app i.e. setting the configurations,
        look and feel of the application. This is the role you will want to
        assign to the most technical people on the team.
      </p>

      <p>
        <b>
          <code>
            {userFriendlyCase(UserPermissions.CAN_MANAGE_ALL_ENTITIES)}
          </code>
        </b>
        : enables users access to all entities.
      </p>

      <p>
        <b>
          <code>{userFriendlyCase(UserPermissions.CAN_MANAGE_DASHBOARD)}</code>
        </b>
        : enables users to build and manage the dashboard.
      </p>

      <p>
        <b>
          <code>
            {userFriendlyCase(UserPermissions.CAN_MANAGE_APP_CREDENTIALS)}
          </code>
        </b>
        : enables users to set up and manage the integrations with supported
        third-party APIs like Slack, Email, HTTP, etc.
      </p>

      <p>
        <b>
          <code>
            {userFriendlyCase(UserPermissions.CAN_MANAGE_PERMISSIONS)}
          </code>
        </b>
        : enables users to manage roles and permissions.
      </p>

      <p>
        <b>
          <code>{userFriendlyCase(UserPermissions.CAN_MANAGE_USERS)}</code>
        </b>
        : enables users to list, create, update, and delete users.
      </p>

      <p>
        <b>
          <code>{userFriendlyCase(UserPermissions.CAN_RESET_PASSWORD)}</code>
        </b>
        : enables users to reset passwords.
      </p>
    </DocumentationRoot>
  );
}
