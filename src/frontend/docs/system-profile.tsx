import { InfoAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function SystemProfileDocumentation(
  props: Omit<IDocumentationRootProps, "children">
) {
  return (
    <DocumentationRoot {...props} title="System Profile Documentation">
      <p>
        Hadmean rolls out its authentication and authorization but sometimes,
        you may want to use the details of your user from other systems in
        Hadmean like their IDs, roles, names, etc.
      </p>
      `System Profile` is how you pass that information to Hadmean.
      <p>
        You will just have to paste in that information as a JSON object, save
        it and it will be regurgitated to you when you need it.
      </p>
      <p>
        For a quick explanation, This system profile can be used to implement
        <ul>
          <li>
            appending the `userId` of who is updating a user account balance to
            the form.
          </li>
          <li>
            disabling the update rank/account balance field for admins when
            updating their profile.
          </li>
          <li>
            Hiding a resend verification button for users already verified.
          </li>
        </ul>
      </p>
      <p>
        Hang tight, we will give more details on this in the sections where they
        will be implemented.
      </p>
      <InfoAlert message="The field is optional, the only requirement is that the value is a valid JSON object." />
    </DocumentationRoot>
  );
}
