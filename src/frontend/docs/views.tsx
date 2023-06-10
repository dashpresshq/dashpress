import { InfoAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "./_base";

export function ViewsDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>Views enables you to implement views like this</p>
      ![Tab Tables](./img/table-tabs.png)
      <p>You simply add all the tabs you want with the `Add new tab` button</p>
      <p>
        For each tab, you will be able to set the title of the tab and customize
        the query for that tab along with the default sorting you desire
      </p>
      <p>
        If you set just one tab then that tab will not show in the UI but the
        settings for that one tab will be implemented.
      </p>
      <InfoAlert message=" Having just one tab is the way to modify the default query for your table." />
    </DocumentationRoot>
  );
}
