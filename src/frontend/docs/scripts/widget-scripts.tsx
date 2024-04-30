import { RenderCode } from "frontend/design-system/components/RenderCode";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { DocumentationRoot } from "../_base";

export function WidgetScriptDocumentation() {
  return (
    <DocumentationRoot>
      <p>
        The widget script is the script that allows you to provide the data that
        the widget will render.
      </p>
      <p>Some notes</p>
      <ul>
        <li>
          This script is run on the server, only the computed value gets to the
          browser.
        </li>
        <li>This script is async, meaning you can do Promises.</li>
        <li>
          You will have access to only this method <code>$.query</code> which is
          the gateway to query your data.
        </li>
        <li>
          You will have access to this magic variable{" "}
          <code>$.RELATIVE_TIME</code> which we will discuss later on in this
          documentation.
        </li>
        <li>Only valid Javascript is allowed here.</li>
        <li>Make sure you return the data you want the widget to render.</li>
        <li>
          The data to be rendered will be validated so if you return some plain
          string for a table widget that expects an array of objects, you will
          get some error message on the widget showing you
          <ol>
            <li>
              <code>data</code>: the data you are trying to render
            </li>
            <li>
              <code>exampleValidData</code>: a valid example data{" "}
            </li>
            <li>
              <code>requiredInterface</code>: the Typescript definition of the
              allowed input{" "}
            </li>
            <li>
              {" "}
              <code>issues</code>: The problems found with the passed data
            </li>
          </ol>
        </li>
        <li>
          The <code>Test Widget Script</code> allows you to preview the script
          before submitting it.
        </li>
      </ul>
      <h4>Table</h4>
      <p>
        The only requirement for the returned table data is that it should be an
        array of objects. The first row of the data returned will be used to
        generate the header for the table.
      </p>
      <p>Below are examples of scripts for the table widget</p>
      <RenderCode
        input={`// As seen the generated examples
return await $.query('SELECT * FROM "[MY_TABLE]" LIMIT 5')

// you can return just static values too
return [{name: "Hannah", age: "30"}, {"name": "Frederick", "age": 45 }]
`}
      />
      <p> You can write the Javascript however you see fit.</p>
      <RenderCode
        input={`function someCustomProcessing(data){
  // Do some custom processing here;
  return data;
}
      
const table = "users";

const data = $.query("SELECT * FROM " + table + " LIMIT 10");

const cleanData = data.map(datum => someCustomProcessing(datum));
// Just make sure to return the data you want to render
return cleanData;`}
      />
      <Spacer />
      <h4>Summary Card</h4>
      <p>Below are valid data for Summary Cards </p>
      <RenderCode
        input={`// 1. numbers or strings that can be parsed to numbers
return 123;
// or
return "123";

// 2. 
return [{count: 123}]
//or 
return [{count: "123"}]

// 3. Result from a count query
return await $.query("SELECT count(*) FROM [MY_TABLE]");`}
      />
      <p>
        The above examples will just show the numeric value with is mostly fine.
        But if you need to show progress on the card, like how your number has
        increased over a certain period, then you can do it by returning an
        array with the first value being the real value and the second value
        being the base value. Check the examples below
      </p>
      <RenderCode
        input={`/* Will render 120 as the value and 20% as the progress
because (120 - 100) / 100 = 20 */
return [120, 100];

/* We also show negative progress in red as the example 
below means the value has decreased 
from 100 to 80 also by 20 percent */
return [80, 100];

/* This also works */
const actual = await $.query(\`SELECT count(*) FROM "users"\`);
const relative = await $.query(\`SELECT count(*) FROM "users" WHERE "createdAt" < '$.RELATIVE_TIME'\`);

return [actual[0], relative[0]];`}
      />
      <Spacer size="xxl" />
      <h4>$.RELATIVE_TIME</h4>
      <p>
        Create a new table widget and paste this
        <RenderCode input={`return [{test: "$.RELATIVE_TIME"}]`} />
        Then exit the dashboard management view by clicking on the
        <code> Done </code> button in the top right corner.
      </p>
      <p>
        You will now see that there is a dropdown of relative times for you to
        select. If you select any of them, you will see that the value of the
        table changes. This is because the value of the relative time is
        computed and is substituted over <code>$.RELATIVE_TIME</code>
      </p>
      <p>
        Basically using the <code>$.RELATIVE_TIME</code> in the script will show
        the relative time dropdown on the widget and the value is substituted
        over the computed relative time. This is very useful to allow users
        selectively see how their data has changed over a period of time.
      </p>
      <p>
        The code below shows how you can allow users to see how much the
        users&apos; count has increased over the selected period.
      </p>
      <RenderCode
        input={`// This line gets the total amount of users in the database
const actual = await $.query(\`
  SELECT count(*) FROM "users"
\`);

/* Here we are using the \`$.RELATIVE_TIME\` to placehold 
the relative time the user selects which we use to filter
with \`createdAt\` to get the number of users in the
database at a particular time */
const relative = await $.query(\`
  SELECT count(*) FROM "users" WHERE "createdAt" < '$.RELATIVE_TIME'
\`);

// Here we merge the two arrays
return [actual[0], relative[0]];`}
      />
      <p>
        This also works on tables script too. You can use the{" "}
        <code>$.RELATIVE_TIME </code>
        to allow users to view the highest-selling product within a relative
        time.
      </p>
    </DocumentationRoot>
  );
}
