import { RenderCode } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";
// done
export function SystemProfileDocumentation(
  props: Omit<IDocumentationRootProps, "children">
) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Since users are created with only three fields
        <code> Username</code>, <code>Name</code> and the <code>Role</code>, you
        will almost definitely want to extend the user details with other info
        like <code>Phone Number</code>, <code>Email</code>,{" "}
        <code>Date of Birth</code> or even external systems ID like{" "}
        <code>Slack Id</code>
      </p>
      <p>
        <code>System Profile</code> allows you to embed such information in the
        system. The field takes in only valid JSON object which contains the
        information you want to associate with the user. A good example will be
      </p>
      <RenderCode
        input={`{
  "email": "jane.doe@company.com",
  "slackId": "123456889",
  "phoneNumber": "+987654321",
  "manager": "Hannah Frederick",
  "department": "Accounting",
  "verified": "Yes"
}`}
      />

      <p>
        You can extend the user&apos;s table by providing the system profile for
        the first user. In pratical steps, if you copy the JSON snippet above
        and paste it on the{" "}
        <b>
          <code>FIRST(Very Important) </code>
        </b>
        user&apos;s <code>System Profile</code> textarea then go back to the
        users table then you will see the new columns <code>Email</code>,{" "}
        <code>Slack Id</code>, <code>Phone Number</code>, <code>Manager</code>,
        <code>Department</code> and <code>Verified</code> on the table and any
        other user&apos;s system profile matching those keys will also be
        displayed.
      </p>
      <p>
        If you remove any field on the first user&apos;s system profile, it will
        not show on the table even if other users have it likewise if you add a
        new field to the system profile and the other users dont have it then it
        will just be blank.
      </p>

      <p>
        The main use for System Profile is for scripting to acheive things like
        <ul>
          <li>
            Getting the email of the user submitting a form and sending them a
            mail or using their email as the <code>From</code> for emails
          </li>
          <li>
            Saving their database userId along with forms they initiated in
            columns like <code>createdById</code>, <code>lastUpdatedById</code>
          </li>
          <li>
            Hiding/Showing a form field based on a state like{" "}
            <code>verified</code> etc.
          </li>
        </ul>
      </p>
      <p>
        We will show how to do all these in the appropriate sections where they
        can be implemented.
      </p>
    </DocumentationRoot>
  );
}
