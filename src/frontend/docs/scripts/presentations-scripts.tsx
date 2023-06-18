import { RenderCode, Spacer, WarningAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "../_base";
// done
export function PresentationScriptDocumentation(
  props: IDocumentationRootProps
) {
  return (
    <DocumentationRoot {...props}>
      <p>
        For a quick showoff, copy and paste the script below, save the form and
        go back to the table.
      </p>
      <RenderCode input={`return "Hannah Frederick";`} />
      <p>
        As you can see all the values on the table are now{" "}
        <code>Hannah Frederick</code>. For more practical use, you can use this
        script to transform how data is presented to the user.
      </p>
      <p>You have 4 variables available to you here</p>
      <ul>
        <li>
          {" "}
          <code>$.value</code> - This is the current value you are transforming{" "}
        </li>
        <li>
          {" "}
          <code>$.field</code> - This is the name of the current field you are
          rendering{" "}
        </li>
        <li>
          {" "}
          <code>$.row</code> - This is the entire value of the row{" "}
        </li>
        <li>
          {" "}
          <code>$.from</code> - This value is either of <code>details</code> |{" "}
          <code>table</code> depending where this is rendered
        </li>
      </ul>
      <p>
        Time for some practical examples, Lets say you are rendering a{" "}
        <code>Posts</code> table with the following fields <code>title</code>,{" "}
        <code>description</code>, <code>commentsCount</code>, <code>image</code>
        , <code>status</code>
      </p>
      <RenderCode
        input={`/* This will prefix the image with the CDN path 
for images stored without paths and suffix the dimension */
if($.field === "image"){
  return "https://cdn.mycompany.com/" + $.value + "?size=320x640";
}

/* This will truncate the description field to the first 
 120 characters only on the table view */
if($.field === "description" && $.from === "table"){
  return $.value.substr(0, 120)
}

// This will transform the comments count from 10,000 to 10K
if($.field === "commentsCount"){
  return ($.value / 1000) + "K"
}

/* This will append the word "[DRAFT]" to start of
 the title if it is in draft status */
if($.field === "title" && $.row.status === "draft"){
  return "[DRAFT]" + $.value;
}

// This transformed the whole table because there was no logic guarding it
return "Hannah Frederick";
`}
      />
      <p>
        As you can see, this is all pure Javascript, you can even create a
        function here and call it. Just make sure you return the value you want
        to present and we will do the rest.
      </p>
      <p>
        This script is not async, meaning you can&apos;t do Promises, so you
        can&apos;t make network calls within this script.
      </p>
      <Spacer />
      <WarningAlert message="Note that this script runs only on the browser so don't do any sensitive thing here" />
      <Spacer />
      <WarningAlert
        message="Any error on this script will fail silently so the original value will be
      used, so be careful to make sure your scripts are valid when making changes"
      />
    </DocumentationRoot>
  );
}
