import { Spacer } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function ViewsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Views enables you to implement query tabs. Say you have an{" "}
        <code>Orders </code> table and you want to show different queries on the
        table like
        <ul>
          <li>
            <code>Latest Orders</code>
          </li>
          <li>
            <code>Priority Orders </code>
          </li>
          <li>
            <code>Active Orders</code>
          </li>
          <li>
            <code>Completed Orders </code>
          </li>
        </ul>
      </p>
      <p>You can do this by:</p>
      <p>
        <ol>
          <li>
            Clicking on the <code>Add New Tab</code> button then you will see a
            new tab, <code>Tab 1</code>
          </li>
          <li>
            Change the default tab name to whatever you want, like say{" "}
            <code>New Orders</code>
          </li>
          <li>
            Ignore the lack of data but filter and order on that empty table
            below as you would on the main table.
          </li>
          <li>
            Add a new tab, give it a label and apply different filters and some
            sorting as you did previously.
          </li>
          <li>
            Click on the <code>Save Views Settings</code>
          </li>
        </ol>
        If you go back to the main table, you will see that your table now has
        the tabs you just specified here.
      </p>
      <p>
        You will see on the tabs the same filters just as you applied them on
        the view settings. This means the filters and sorting saved on the view
        settings are just default values so other users can still edit the
        filters as they see fit.
      </p>
      <Spacer />
    </DocumentationRoot>
  );
}
