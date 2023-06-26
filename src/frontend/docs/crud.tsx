import { InfoAlert } from "frontend/design-system/components/Alert";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function CRUDDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        This setting generally allows you to disable CRUD functionalities and
        some of the CRUD field
      </p>
      <h4>Table</h4>
      <p>
        Say you have a very large table with about 15 fields and say only 10 of
        them are relevant on the table. The <code>Table</code> tab allows you to
        toggle off the 5 other fields hereby showing only the 10 fields on the
        table.
      </p>
      <p>
        You can&apos;t disable a <code>Table</code>; you can only disable an
        entity which can be done at the <code>Entities Settings</code>
      </p>
      <InfoAlert
        message={`Note that this filtering is done in the backend so any 
        data belonging to the filtered-out field will not get to the UI. 
        We only query the database for the fields we are going to present hereby 
        decreasing the workload on your database and ensuring
        that those data do not leak out of your server.`}
      />
      <Spacer size="xl" />
      <h4>Details</h4>
      <p>
        The same behavior for the fields selection as with tables, hide a field
        and we will not show it on the details view, and disabled fields are not
        queried for in the backend.
      </p>
      <p>
        But we have an extra button <code>Enable Details Functionality</code>.
        This button allows you to remove the <code>Details</code> action for
        that entity. Meaning, the <code>eye</code> icon on the table view will
        be hidden and if you try to access the details view through the URL, you
        will get an error or if you try to access the details API, you will also
        get an error.
      </p>
      <h4> Create/Update </h4>
      <p>
        Here disabling a field removes it from the respective forms, which
        allows you to remove the fields that are not needed on the forms. As
        with the table and the details, when you disable a field the backend
        will ignore the field even if a value is provided.
      </p>
      <p>
        The <code>Enable Create/Update Functionality</code> will hide/show the
        create/update forms respectively and all these are checked in the
        backend also. If you make a create request to a disabled create entity,
        you will get an error; likewise with the update view.
      </p>

      <h4> Delete </h4>
      <p>
        Here you can only disable the delete functionality and as you might
        guess this is also checked in the backend, so if you try to make an API
        request to delete a delete-disabled entity, you will get an error.
      </p>
    </DocumentationRoot>
  );
}
