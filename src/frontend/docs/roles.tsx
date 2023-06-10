import { InfoAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function RolesDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Hadmean as two default roles, `creator` and `viewer`. They are not
        editable or deletable, they don&apo;t even exist physically and are
        inferred most of the time.
      </p>

      <h4> Creator</h4>
      <p>
        This is the `can-do-all` things role, this is the role the user
        installing the application gets assigned.
      </p>

      <h4>Viewer</h4>
      <p>
        This role has only `CAN_ACCESS_ALL_ENTITIES`. `Viewers` who can only
        view and manage all enabled data but can&apo;t configure the app, manage
        users, manage roles, reset passwords etc.
      </p>

      <InfoAlert message="If a user is assigned a role and the role is deleted, then the user will be assigned the `viewer` role." />

      <h4>Custom roles</h4>
      <p>
        From the UI you can easily create as many roles as you want and assign
        as many permissions as you like.
      </p>

      <h4>Permissions Breakdown </h4>
      <p>
        <code>CAN_CONFIGURE_APP</code>
        Gives users access to the app configuration menu.
      </p>

      <p>
        <code>CAN_RESET_PASSWORD</code>
        allows users to reset passwords.
      </p>

      <p>
        <code>CAN_MANAGE_PERMISSIONS</code>
        allows users to manage roles and permissions.
      </p>

      <p>
        <code>CAN_MANAGE_USERS</code>
        will allow users to CRUD users.
      </p>

      <p>
        <code>CAN_ACCESS_ALL_ENTITIES</code>
        allows user access to present and future entities.
      </p>

      <p>
        <code>CAN_ACCESS_ENTITY:ENTITY</code>
        Allows access to only that entity. Remember to remove the
        `CAN_ACCESS_ALL_ENTITIES` permission when you toogle any of these on.
      </p>
    </DocumentationRoot>
  );
}
