import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function FieldsSettingsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        You will be able to make field-level customizations on the tables,
        details, create, and edit views. We have three tabs here, so let&apos;s
        start with the first.
      </p>
      <h4> Labels</h4>
      <p>
        This tab enables you to rename the label of the field. Say you want the
        <code> name</code> to be called <code>Full Name</code>, or{" "}
        <code>updatedAt</code> to be called <code>Last Updated</code>; then you
        simply input the desired name under the field and submit and the column
        will be renamed everywhere.
      </p>
      <h4> Types</h4>
      <p>
        Two quick notes as we head into this section
        <ol>
          <li>
            Hadmean is not a database client, meaning any action taken here will
            not reflect on your database.
          </li>
          <li>
            We strongly advise that you edit your schema to minimize your
            touching of this section.
          </li>
        </ol>
      </p>
      <p>Having said that, there are three things you can do in this section</p>
      <h5>1. Choosing A More Specific Data Type</h5>
      <p>
        Here you can be more specific about the type of your field, You can
        choose a more appropriate field type like <code>email</code>,{" "}
        <code> URL</code>, <code> color</code>
        <code> image</code> over the plain <code>text</code> field type.
      </p>
      <p>
        You will see that some field types are disabled and these are for fields
        like <code>boolean</code>, <code>date</code>, <code>enum</code>, etc.
        which really don&apos;t have sister types so there is nothing you can
        update it to.
      </p>
      <p>
        You will also see that the selections are narrowed as you will not see
        an
        <code> email</code> selection for a numerical field nor will you see the{" "}
        <code>number</code> for the
        <code> text</code> field. This is to eliminate the possibility of an
        invalid selection.
      </p>
      <h5>2. Managing Validations</h5>
      <p>
        Hadmean will try to pick all the database validations that it can, so it
        knows the
        <code> non-nullable</code> constraint means the field is{" "}
        <code>required</code> and so on. We also translate other constraints to
        validations like <code>maxLength</code>, <code>isDate</code>,{" "}
        <code>unique</code>, <code>isBoolean</code> etc.
      </p>
      <p>
        Note that validations picked from the database can&apos;t be removed
        from the app. The only way to remove them is to delete them from the
        database and restart your app.
      </p>
      <p>
        The <code> Configure Validation</code> button allows you to add more
        validations that we can&apos;t possibly get from the database like{" "}
        <code>minLength</code>,<code> regex</code>, <code>alphanumeric</code>,{" "}
        <code>matchOtherField</code>, etc. We also provide a text input for you
        to customize the validation message.
      </p>
      <h5> 3. Configure Selection</h5>
      <p>
        When the field is an enum field or you select <code>selection</code> as
        the type, You will see a <code>Configure Selections</code> button which
        will allow you to select colors for enum field types and manage the
        selections for the <code>selection</code> type.
      </p>
      <h4> Order</h4>
      <p>
        Here you will be able to order the fields around and the order will also
        be reflected on tables, details view, and forms.
      </p>
    </DocumentationRoot>
  );
}
