import { InfoAlert, WarningAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function FieldsSettingsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        This view allows you to make field-level customizations. All
        customization will be reflected on the tables, details view, create form
        and edit form
      </p>
      <h4> Labels</h4>
      <p>
        This tab enables you to rename the label of the field. Say you want to
        <code>name</code> to be called <code>Full Name</code> or{" "}
        <code>updatedAt</code> to be called <code>Last Updated</code> then you
        simple input the desired name under the field and submit and the column
        will be renamed everywhere
      </p>
      <h4> Types</h4>
      <WarningAlert message="It is un-evitable that this tab will be edited but we strongly advise that you structure your schema to minimize you touching this section" />
      <p>There are three things you can do in this section</p>
      <h5> Specific Type</h5>
      <InfoAlert message="No action taken here will reflect on your database, If you are looking for that then you will need to look for a database client and we will not be supporting this." />
      <p>
        Databases have limits on the types of data you want to save, so we
        usually end up using <code>text</code> to represent <code>email</code>,{" "}
        <code>url</code>, <code>color</code>
        <code>image</code>. With the section, you can have a more specific type
        for your data and Hadmean will use this information to build the most
        appropriate view/form field for your data
      </p>
      <p>
        You will notice that some selections are disabled and these are for
        fields like <code>boolean</code>, <code>date</code>, <code>enum</code>{" "}
        etc. which really don&apos;t have sister types so there is nothing you
        can update it to
      </p>
      <p>
        You will also see that the selections are narrowed as you will not see a
        <code>email</code> selection for a numerical field nor will you see{" "}
        <code>number</code> for
        <code>text</code> field, This is to reduce the chances of bad selection
      </p>
      <h5> Validations</h5>
      <p>
        Hadmean, will try to pick all the database validations that it can, Like
        <code>non-nullable</code> means <code>required</code>. As such all
        fields with <code>non-nullable</code>
        will be required in the form and this is not editable, If you need to
        change this, then you database has to be change and we will pick it up
        the next time you spin the application.
      </p>
      <p>
        We also add default validations for <code>maxLength</code>,{" "}
        <code>isDate</code>, <code>unique</code>,<code>isBoolean</code> etc. As
        said earlier these validations can&apos;t be edited so you will need to
        update your database to make these changes.
      </p>
      <p>
        But databases don&apos;t contain all the validations, So we provide the
        <code>Configure Validation</code> to let you add more validations like{" "}
        <code>minLength</code>,<code>regex</code>, <code>alphanumeric</code>,{" "}
        <code>matchOtherField</code> etc.
      </p>
      <InfoAlert message=" All validations picked from the database can't be removed but added validations can be" />
      <p>
        We also provide a text input for you to customize the validation message
      </p>
      <h5> Selection</h5>
      <p>TODO</p>
      <h4> Order</h4>
      <p>
        This allows you to order the fields around and the order will also be
        reflected on tables, details view and forms
      </p>
    </DocumentationRoot>
  );
}
