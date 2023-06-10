import { InfoAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function RelationsSettingsDocumentation(
  props: Omit<IDocumentationRootProps, "children">
) {
  return (
    <DocumentationRoot {...props} title="System Profile Documentation">
      <h4> Reference Template</h4>
      <p>
        Reference Template is how you define how this entity will be displayed
        where it is being referenced
      </p>
      <p>
        Say you have `users` table in your application with the fields
        `first_name`, `last_name` and `title`. Reference Template is how you
        define how it will be rendered
      </p>

      <p>
        {"`{{ title }} {{ first_name }} {{ last_name }}`"} will be templated as
        `Mr John Doe`
      </p>

      <p>
        `{"{{ last_name }} {{ first_name }}`"} will be templated as `Doe John`
      </p>

      <p>
        {"`{{ first_name }} / {{ last_name }}`"} will be templated as `John /
        Doe`
      </p>

      <p>
        It uses mustache under the hood, so bring in all your mustache knowledge
        here
      </p>

      <p>
        When editing reference templates, The fields will be validated so as to
        eliminate typos for example {"`{{ ffirst_namee }}`"} will give an error
        until corrected likewise fields that don&apos;t exist
      </p>

      <InfoAlert message="The default value for the reference template are the two first text fields of the entity" />

      <h4> Labels</h4>
      <p>
        This allows you to label the relations on the details view. Say you have
        a post and the related user i.e the creator is coming out as `user`
        because that is the entity name but you would rather it come out as
        `Author` as that is more befitting name, You can simply do that here by
        filling in the desired name under the input of the entity you want to
        re-label
      </p>

      <h4> Selection</h4>
      <p>
        This allows you to select the related entities you want to be displayed
        on the details view for the current entities
      </p>

      <p>
        Say you have 15 related entities say for users and you don&apos;t want
        all the 15 entities to be on the side bar when you view a user detail,
        Then you can simply toggle off the entities you don&apos;t want to show
        on users details and they will no longer appear
      </p>

      <p>
        Note that all disabled entities on the app will not show up on this list
      </p>

      <h4> Order</h4>
      <p>
        This simply will allow you to order how the related entities will be
        displayed on the details page
      </p>
    </DocumentationRoot>
  );
}
