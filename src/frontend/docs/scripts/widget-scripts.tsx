import { RenderCode, Spacer } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "../_base";

export function WidgetScriptDocumentation(props: IDocumentationRootProps) {
  return <DocumentationRoot {...props}>
    <p>
      Widget script is the script that allows you provide the data that the
      widget will render.
    </p>
    <p>Some notes</p>
    <ul>
      <li>
        This script is run on the server, only the computed value gets to the browser.
      </li>
      <li>
        This script is async, meaning you can do Promises.
      </li>
      <li>
        You will have access to only this method <code>$.query</code> which is
        the gateway to query your data.
      </li>
      <li>
        Only valid Javascript is allowed here.
      </li>
      <li>
        Make sure you return the data you want the widget to render.
      </li>
      <li>
        The data to be rendered will be validated so if you return some plain string for a table widget that
        expects an array of object, you get see some error message on the widget showing you
        <ol>
          <li><code>data</code>: the data you are trying to render</li>
          <li><code>exampleValidData</code>: a valid example data </li>
          <li><code>requiredInterface</code>: the Typescript definition of the allowed input </li>
          <li> <code>issues</code>: The problem it found with the passed data</li>
        </ol>
      </li>
      <li>
        The <code>Test Widget Script</code> allows you to preview the script before submitting
      </li>
    </ul>
    <h4>Table</h4>
    <p>
      The only requirement for the returned table data is that it should be an array of objects.
      The first row of the data returned will be used to generate the header for the table.
    </p>
    <p>
      Below are valid examples script for the table widget
    </p>

    <RenderCode input={`// As seen the generated examples
return await $.query('SELECT * FROM "[MY_TABLE]" LIMIT 5')

// you can return just static values too
return [{name: "Hannah", age: "30"}, {"name": "Frederick", "age": 45 }]
`} />
    <p> You can write the Javascript how ever you see fit.
    </p>
    <RenderCode input={`function someCustomProcessing(data){
  // Do some custom processing here;
  return data;
}
      
const table = "users";

const data = $.query("SELECT * FROM " + table + " LIMIT 10");

const cleanData = data.map(datum => someCustomProcessing(datum));
// Just make sure to return the data you want to render
return cleanData;`} />
    <Spacer />
    <h4>
      Summary Card
    </h4>
    <p>
      The requirement for the returned data for Summary Cards are
      <RenderCode input={`// 1. numbers or strings that can be parsed to numbers
return 123;
// or
return "123";

// 2. 
return [{count: 123}]
//or 
return [{count: "123"}]

// 3. Result from a count query
return await $.query("SELECT count(*) FROM [MY_TABLE]");
  `} />
    </p>
  </DocumentationRoot>;
}
