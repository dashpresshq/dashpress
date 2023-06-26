import { RenderCode } from "frontend/design-system/components/RenderCode";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { DocumentationRoot, IDocumentationRootProps } from "../_base";

export function FormScriptDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Forms scripts enable you to implement the complex form logic your
        business requirements require that the UI cannot achieve.
      </p>
      <p>
        In the <code>Form Scripts</code>, you will have access to the following
        variables:
        <ul>
          <li>
            <b>
              <code>$.formValues</code>
            </b>
            : This gives you current form values.
          </li>
          <li>
            <b>
              <code>$.action</code>
            </b>
            : The values are either{" "}
            <code>&quot;update&quot; | &quot;create&quot;</code> which allows
            you to condition the script for the creation or update form.
          </li>
          <li>
            <b>
              <code>$.auth</code>
            </b>
            : The current user object with the following fields
            <ol>
              <li>
                <code>$.auth.role</code>
              </li>
              <li>
                <code>$.auth.name</code>
              </li>
              <li>
                <code>$.auth.username</code>
              </li>
              <li>
                <code>$.auth.systemProfile</code>
              </li>
            </ol>
          </li>
        </ul>
      </p>
      <p>
        Form scripts are run on the client and they are not async so you
        can&apos;t make Promises or make network calls.{" "}
      </p>
      <p>
        We have two tabs where which do different things so let&apos;s start
        with the first
      </p>
      <h4>1. Field State</h4>
      <p>
        This allows you to hide or disable your form fields. Let&apos;s dive
        straight into examples
      </p>
      <RenderCode
        input={`// This script will disable the "accountBalance" field.
return {
  accountBalance: {
    disabled: true
  }
}

// This will hide the "accountBalance" field
return {
  accountBalance: {
    hidden: true
  }
}

/*
This will disable the "canRegister" field
when the value of "age" is less than 18
*/
return {
  canRegister: {
    disabled: $.formValues.age < 18
  },
}

/* 
This will hide the "whatCanWeDoBetter" field 
when the value of "rating" is equal than 5
*/
return {
  whatCanWeDoBetter: {
    hidden: $.formValues.rating == 5
  }
}

/* 
This will hide the "accountBalance" field 
when the current user is updating his account  
*/
return {
  accountBalance: {
    hidden: $.auth.username === $.routeParams.entityId
  }
}

/* 
There is no limit to the composition 
*/
return {
  field1: {
    hidden: someLogic == true
  },
  field2: {
    disabled: someLogic == false,
    hidden: someLogic == true,
  },
  field3: {
    hidden: someLogic != true
  }
}
`}
      />
      <p>
        We use the field name, not the field label. For example, if you want to
        target the <code>accountBalance</code>, using{" "}
        <code>Account Balance </code>
        will not work or any label that is shown in the form. What is used is
        the database field name which is <code>accountBalance</code> any other
        label will not work.{" "}
      </p>
      <h4>2. Before Submit</h4>
      <p>This tab enables you to do two different things.</p>
      <h5>1. Run custom validation</h5>
      <p>
        Data validation can easily become complex and with this tab, you should
        be able to tame the complexity of your validation requirements.
      </p>
      <p>
        This is how it works, When a string is returned from this tab, then the
        value is seen as an error which will be shown to the user and the form
        will not be submitted.
      </p>

      <RenderCode
        input={`/*
This script will not allow users submit the form
and will be seeing the message in an alert,
*/
return "You shall not pass"

/* 
For more practical use, you will want to wrap the text 
in a logic block and can it be as complex as needed
*/
if(
    $.formValues.age > 1000 && 
    (
      $.formValues.planet != "Earth" ||
      $.formValues.technology == "Advance" 
    )
  ) {
  return "Only Aliens can submit this form"
}

// This is plain Javascript so you can write functions too.
const customFunctionToReturnFalse = () => false

if(customFunctionToReturnFalse()){
    return "Custom function returned false"
}

// Once the script validation gets to the bottom
// then it will be submitted`}
      />

      <p>
        The validations parsed from your database and the ones you added from
        the <code>Fields</code> tab will run first before the ones on this
        script.
      </p>

      <Spacer />
      <h5>2. Modify the form values</h5>
      <p>
        The second use for this tab to is modify the data you are submitting.
      </p>
      <p>
        This is how it works, If you return an <code>object</code>, then that
        object will be what will be submitted. This allows you to append and
        remove fields to the original submitted data.
      </p>
      <RenderCode
        input={`/*
Will add "createdById" to the form values that is to be submitted
*/
return {
  ...$.formValues,
  createdById: JSON.parse($.auth.systemProfile).userId
}

/*
Will add "createdAt" to the form values that is to be submitted
*/
return {
  ...$.formValues,
  createdAt: new Date(),
}

/*
You can compute fields to save
*/
return {
  ...$.formValues,
  slug: $.formValues.title
    .replaceAll(" ", "-")
    .toLowerCase()
}`}
      />
      <Spacer />
      <p>
        Needless to say, you can combine both <code>Before Submit</code> usages
        to both validate data before submitting and transform the data when
        submitting in the same script.
      </p>
      <RenderCode
        input={`/**
 * Will validate the form and will throw the error when it returns a string
 * And will add "createdById" when the form is submitted
 */
if($.formValues.age > 23 && ($.formValues.country != "Belgium" || $.formValues.height == 124 )){
  return "This is a weird requirement and Hadmean can handle it"
}

return {
  ...$.formValues,
  createdById: JSON.parse($.auth.systemProfile).userId
}`}
      />
    </DocumentationRoot>
  );
}
