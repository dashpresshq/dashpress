import { msg } from "@lingui/macro";
import { Trans } from "@lingui/react";
import { DocumentationRoot } from "./_base";

export function FieldsSettingsDocumentation() {
  const TransTexts = [
    msg`You will be able to make field-level customizations on the tables,
  details, create, and edit views. We have three tabs here, so let&apos;s
  start with the first.`,
    msg`Labels`,
    msg`This tab enables you to rename the label of the field. Say you want the
        <code> name</code> to be called <code>Full Name</code>, or
        <code>updatedAt</code> to be called <code>Last Updated</code>; then you
        simply input the desired name under the field and submit and the column
        will be renamed everywhere.`,
    msg`Types`,
    msg`Two quick notes as we head into this section`,
    msg`DashPress is not a database client, meaning any action taken here
            will not reflect on your database.`,
    msg`We strongly advise that you edit your schema to minimize your
            touching of this section.`,
    msg`Having said that, there are three things you can do in this section`,
    msg`1. Choosing A More Specific Data Type`,
    msg`Here you can be more specific about the type of your field, You can
        choose a more appropriate field type like <code>email</code>,
        <code> URL</code>, <code> color</code>
        <code> image</code> over the plain <code>text</code> field type.`,
    msg`You will see that some field types are disabled and these are for fields
        like <code>boolean</code>, <code>date</code>, <code>enum</code>, etc.
        which really don&apos;t have sister types so there is nothing you can
        update it to.`,
    msg`You will also see that the selections are narrowed as you will not see
        an
        <code> email</code> selection for a numerical field nor will you see the
        <code>number</code> for the
        <code> text</code> field. This is to eliminate the possibility of an
        invalid selection.`,
    msg`2. Managing Validations`,
    msg`DashPress will try to pick all the database validations that it can, so
        it knows the
        <code> non-nullable</code> constraint means the field is
        <code>required</code> and so on. We also translate other constraints to
        validations like <code>maxLength</code>, <code>isDate</code>,
        <code>unique</code>, <code>isBoolean</code> etc.`,
    msg`Note that validations picked from the database can&apos;t be removed
        from the app. The only way to remove them is to delete them from the
        database and restart your app.`,
    msg`The <code> Configure Validation</code> button allows you to add more
        validations that we can&apos;t possibly get from the database like
        <code>minLength</code>,<code> regex</code>, <code>alphanumeric</code>,
        <code>matchOtherField</code>, etc. We also provide a text input for you
        to customize the validation message.`,
    msg`3. Configure Selection`,
    msg`When the field is an enum field or you select <code>selection</code> as
        the type, You will see a <code>Configure Selections</code> button which
        will allow you to select colors for enum field types and manage the
        selections for the <code>selection</code> type.`,
    msg`Order`,
    msg`Here you will be able to order the fields around and the order will also
        be reflected on tables, details view, and forms.`,
  ];

  return (
    <DocumentationRoot>
      <p>
        <Trans id={TransTexts[0].id} />
      </p>
      <h4>
        <Trans id={TransTexts[1].id} />
      </h4>
      <p>
        <Trans id={TransTexts[2].id} />
      </p>
      <h4>
        <Trans id={TransTexts[3].id} />
      </h4>
      <p>
        <Trans id={TransTexts[4].id} />
        <ol>
          <li>
            <Trans id={TransTexts[5].id} />
          </li>
          <li>
            <Trans id={TransTexts[6].id} />
          </li>
        </ol>
      </p>
      <p>
        <Trans id={TransTexts[7].id} />
      </p>
      <h5>
        <Trans id={TransTexts[8].id} />
      </h5>
      <p>
        <Trans id={TransTexts[9].id} />
      </p>
      <p>
        <Trans id={TransTexts[10].id} />
      </p>
      <p>
        <Trans id={TransTexts[11].id} />
      </p>
      <h5>
        <Trans id={TransTexts[12].id} />
      </h5>
      <p>
        <Trans id={TransTexts[13].id} />
      </p>
      <p>
        <Trans id={TransTexts[14].id} />
      </p>
      <p>
        <Trans id={TransTexts[15].id} />
      </p>
      <h5>
        <Trans id={TransTexts[16].id} />
      </h5>
      <p>
        <Trans id={TransTexts[17].id} />
      </p>
      <h4>
        <Trans id={TransTexts[18].id} />
      </h4>
      <p>
        <Trans id={TransTexts[19].id} />
      </p>
    </DocumentationRoot>
  );
}
