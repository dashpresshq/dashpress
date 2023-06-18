import { RenderCode } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

// done
export function RelationsSettingsDocumentation(
  props: Omit<IDocumentationRootProps, "children">
) {
  return (
    <DocumentationRoot {...props}>
      <p>
        This setting helps you manage how this entity will be presented on other
        tables when referenced and also how you can organise the related
        entities on the details view.
      </p>
      <h4> Reference Template</h4>
      <p>
        When entities are referenced, the app tries to show the best two fields
        it thinks are the best to present and sometimes it doesn&apos;t get it
        quite right or maybe it needs improvement.
      </p>
      <p>
        For example when a table references the <code>Users</code> table, the
        app might select the <code>Username</code> and <code>Firstname</code> as
        the reference template. So if you want it to be the combination of the{" "}
        <code>Firstname</code> and <code>Lastname </code>
        instead you can set that in this form with
        <RenderCode input={`{{ first_name }} {{ last_name }}`} />
        and the users will start showing in this format.
      </p>

      <p>
        This form uses Mustache so any of valid Mustache format will work. Below
        are some valid templates
        <RenderCode
          input={`{{ title }} {{ first_name }} {{ last_name }}
/* "Mr John Doe" */

{{ first_name }} / {{ last_name }}
/* "John - Doe" */`}
        />
      </p>
      <p>
        When editing reference templates, The fields will be validated so as to
        eliminate typos, for example <code>{"{{ ffirst_namee }}"}</code> will give an error
        until corrected, in the same manner fields that don&apos;t exist on that entity will give you errors
      </p>

      <h4> Labels</h4>
      <p>
        Say you go to a post details and the author entity is showing as <code>User</code> because
        that is the entity name but you would rather it be labelled a more
        contextual title like <code>Author</code>
        , you can simply do that here by
        filling in the desired name at entity input and this name will only appear under this
        entity relation list.
      </p>

      <h4> Selection</h4>
      <p>
        Say you have 15 related entities say for <code>Users</code> and you don&apos;t want
        all the 15 entities to be on the relations list when you view a user detail,
        Then you can simply toggle off the entities you don&apos;t want to show
        on users details and they will no longer appear.
      </p>

      <p>
        Keep in mind that all disabled entities on the app will not show up on this list
      </p>

      <h4> Order</h4>
      <p>
        Order the related entities how you want them to appear on the relations list.
      </p>
    </DocumentationRoot>
  );
}
