import { InfoAlert, WarningAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function CRUDDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <h4>Table</h4>
      <p>
        This tab allows you to select the columns you want to show on the table
        for this entity. Note that this filtering is done in the backend so any
        filtered-out column data will not get to the UI. We only query your
        database for the fields we are going to present.
      </p>
      <h4> Details </h4>
      <p>
        This tab allows you to select the columns to show on the details view.
        As with tables, the filtering is done in the backend.
      </p>
      <p>
        The `Hide Details Button` toggles the view button and will show an error
        if you try to view the details page for the entity. Toggling it off will
        disable the selection.
      </p>
      <h4> Create/Update </h4>
      <p>
        This allows you to select the fields you want in the create/update form.
        Useful to hide timestamp columns, ID fields etc.
      </p>
      <WarningAlert
        message="If the update view is enabled but the details view is not, then
no data will be passed to the UI. "
      />
      <p>
        Also, the toggle button will hide/show the create/update button
        respectively.
      </p>
      <h4> Delete </h4>
      <p>
        Here you can only manage the hide/show of the delete button for the
        entity.
      </p>
      <InfoAlert
        renderJsx
        message={
          <>
            All the settings on this page are also checked on the server.
            <br />
            So if you disable delete for an entity and you try to delete it
            through our API, You will get a 401 error. Same for create, update
            and details.
            <br />
            If you can&apos;t do it in the front-end then you also can&apos;t do
            it in the back-end.
          </>
        }
      />
    </DocumentationRoot>
  );
}
