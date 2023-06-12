import { InfoAlert, WarningAlert } from "@hadmean/chromista";
import { DocumentationRoot, IDocumentationRootProps } from "../_base";
import { RenderCode } from "../_RenderCode";

export function FormScriptDocumentation(props: IDocumentationRootProps) {
  return (
    <DocumentationRoot {...props}>
      <p>
        Forms complexities always grow in parallel with business requirements
        and we believe giving you coding access to your manage your forms will
        help you when the requirements get complex as opposed to making things
        visual which will block you when your requirement gets too complex.
      </p>
      <p>
        As you will expect you will need some Javascript knowledge to proceed in
        this section
      </p>
      <p>There are three forms that we use to achieve this</p>
      <h4>API</h4>
      <p>First, let talk about the API, The objects available to you are</p>
      <RenderCode
        input={`{
    // The current/submit values in the form
    formValues: Record<string, string>,
    // All the route params
    routeParams: Record<string, string>,
    // Whether the action is for create or for update
    action: "update" | "create" , 
    // The user authenticated profile
    auth: {
        // The Hadmean profile name
        name: string;
        // The Hadmean username name
        username: string;
        // The system profile for the user
        // More info on this at /docs/accounts/system-profile 
        systemProfile?: string;
        // The Hadmean role name
        role: string;
    }
  }`}
      />
      <p>They are accessed through the dollar sign `$.`.</p>
      <p>
        You will find full examples below which give you a better understanding
      </p>
      <InfoAlert message="The initial `formValues` for the update form contains the fields that you expose in the details view." />
      <WarningAlert message="All the code written here will be run on the client, So please be careful to not paste any private configuration keys here" />
      <p>See the content of the three forms as the body of a function,</p>
      <p>We have plenty examples below</p>
      <h4>Field State</h4>
      <p>This allows you to hide or disable your form fields.</p>
      <p>Examples</p>
      <RenderCode
        input={`/* 
Having just this in the "Field State" will disable 
the "accountBalance" field all the time 
*/
return {
  accountBalance: {
    disabled: true
  }
}
`}
      />
      <RenderCode
        input={`/* 
Having just this in the "Field State" 
will disable the "canRegister" field
when the value of "age" is less than 18  
*/
return {
  canRegister: {
          disabled: $.formValues.age < 18
  },
}

/* 
Will hide the "reasons" field 
when the value of "rating" is less than 3
*/
return {
     reasons: {
          hidden: $.formValues.rating < 3
     }
}

/* 
  You can do cool stuffs like 
  hiding the "canUpdateBalance" field 
  if the current user is updating his account  
*/
return {
     canUpdateBalance: {
          hidden: $.auth.username === $.routeParams.username
     }
}

/* 
   Since this is all javascript object 
   there is no limit to the composition 
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
      <h4>Before Submit</h4>
      <p>You can do two things with this</p>
      <h5>1. Run custom validation</h5>
      <p>
        Our validations are already extensive but can never be extensive enough.
      </p>
      <p>
        If a string is returned from the computation of the `beforeSubmit`. Then
        the value is seen as an error will be toasted to the user as an error
        and the form will not be submitted, So you can get dirty along your
        business requirement.
      </p>
      <p>
        Note that this doesn&apos;t replace any validation you may have on the
        form as those validations will run first before triggering the
        `beforeSubmit`. You are encouraged to use the validations we have and
        only use this when your requirement get out of hand
      </p>
      <RenderCode
        input={` 
        Will not let the user proceed with the form
        and will toast message with error to the user
      */
     return "You shall not pass"
`}
      />
      <RenderCode
        input={`
     /* 
        As long as it valid JS, You can throw in what ever you want
     */

     if($.formValues.age > 23 && ($.formValues.country != "Belgium" || $.formValues.height == 124 )){
        return "This is weird requirement and Hadmean can handle it"
     }

     const customFunctionToReturnFalse = () => false

     if(customFunctionToReturnFalse()){
          return "Custom function returned false"
     }
     
     // if the code gets here then the form will be submitted
     `}
      />
      <h5>2. Modify form</h5>
      <p>
        If you return an object, then that will be submitted for our endpoint,
        This makes you do cool stuff like appending `createdById`/`updatedById`
        to forms. You can add/remove/edit fields, It is plain JS and we will
        just send what you return
      </p>
      <RenderCode
        input={`
   /*
     Will add "createdById" to the form values that is to be submitted
   */
     return {
          ...$.formValues,
          createdById: JSON.parse($.auth.systemProfile).userId
     }
  `}
      />
      And as you might have guessed you can combine it all
      <RenderCode
        input={`
/**
 * Will validate the form and will throw the error when it returns a string
 * And will add "createdById" when the form is submitted
 */
    if($.formValues.age > 23 && ($.formValues.country != "Belgium" || $.formValues.height == 124 )){
        return "This is weird requirement and Hadmean can handle it"
     }

     return {
          ...$.formValues,
          createdById: JSON.parse($.auth.systemProfile).userId
     }
  `}
      />
    </DocumentationRoot>
  );
}
