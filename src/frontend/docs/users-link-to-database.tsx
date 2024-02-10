import { DocumentationRoot } from "./_base";

export function UsersLinkToDatabaseDocumentation() {
  return (
    <DocumentationRoot>
      <p>
        Linking your DashPress users to your database allows you to write
        user-specific scripts by powering the scripts with information about the
        user from your users&apos; database. For example,
        <ul>
          <li>
            <strong>Form Scripts</strong> - You might want to attach the current
            user ID as the <code>createdById</code> of the record.
          </li>
          <li>
            <strong>Form Actions</strong> - You might want to fetch the current
            user&apos;s email and set their email as the sender of the email.
          </li>
          <li>
            <strong>Workflows </strong> - You might want to fetch the current
            user&apos;s department and use it to determine some logic in the
            workflow.
          </li>
        </ul>
      </p>
      <p>
        As you can see there is no way for DashPress to know these user&apos;s
        information without linking the users to your database. Technically,
        this can be implemented but it will be a duplication of effort as you
        will need to update the user details on Dashpress and your database.
      </p>
      <p>
        Linking is done by telling us which table contains your users&apos;
        information and which field in that table corresponds to
        DashPress&apos;s username field. Most likely you will be using the email
        column for this or any other unique column like username. If your
        DashPress usernames are set arbitrarily then you will need to update
        them to match.
      </p>
      <p>
        Linking your users does not do any importing, so you will still need to
        create the users on DashPress. The linking is just to tell DashPress
        where to look for the user details. Also, we don&apos;t do any write
        operations on your user table. All our operations are read-only. All we
        need to link the users are saved on our configuration.
      </p>
      <p>
        After you link your users, all scripts in the application will be
        injected the <code>$.auth</code> variable will have the user details
        from your database available in the script.
      </p>
    </DocumentationRoot>
  );
}
