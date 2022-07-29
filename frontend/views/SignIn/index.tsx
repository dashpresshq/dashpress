// import React from "react";
// import { Form, Field } from "react-final-form";
// import {
//   ErrorAlert,
//   WarningAlert,
// } from "@mdstores/shared/dist/components/Alert";
// import {
//   FormInput,
//   FormButton,
//   FormCheckBox,
// } from "@mdstores/shared/dist/components/Form";
// import {
//   composeValidators,
//   isEmail,
//   required,
// } from "@mdstores/shared/dist/validations";
// import styled from "styled-components";
// import { getResponseStatusCode } from "@mdstores/shared/dist/utils/response";
// import * as StyledGrid from "styled-bootstrap-grid";
// import { RequestService, AuthService } from "@gothicgeeks/shared";
// import { Link } from "react-feather";
// import { useMutation } from "react-query";
// import { StyledAccountText, StyledAccountTextWrapper } from "../Styles";

// const StyledFirstTextRow = styled(StyledGrid.Row)`
//   margin-top: 1rem;
//   margin-bottom: 1rem;
// `;

// const StyledTextRightCol = styled(StyledGrid.Col)`
//   text-align: right;
// `;

// // const StyledSocialButtonGroup = styled.div`
// //   width: 100%;
// // `;

// interface IProps {
//   onSubmit: (values: Record<string, string>) => void;
//   isMakingRequest: boolean;
// }

// export function SignInPresentation({ onSubmit, isMakingRequest }: IProps) {
//   return (
//     <Form
//       onSubmit={onSubmit}
//       render={({ handleSubmit }) => {
//         return (
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubmit(e);
//             }}
//           >
//             <Field
//               name="email"
//               validate={composeValidators(required, isEmail)}
//               validateFields={[]}
//             >
//               {(renderProps) => (
//                 <FormInput
//                   type="email"
//                   label="Email"
//                   {...renderProps}
//                   data-test-id="signin__email"
//                 />
//               )}
//             </Field>
//             <Field
//               name="password"
//               validate={composeValidators(required)}
//               validateFields={[]}
//             >
//               {(renderProps) => (
//                 <FormInput
//                   label="Password"
//                   type="password"
//                   {...renderProps}
//                   data-test-id="signin__password"
//                 />
//               )}
//             </Field>

//             <StyledFirstTextRow>
//               <StyledGrid.Col col={6}>
//                 <Field name="rememberMe" validateFields={[]}>
//                   {(renderProps) => (
//                     <FormCheckBox label="Remember Me" {...renderProps} />
//                   )}
//                 </Field>
//               </StyledGrid.Col>
//             </StyledFirstTextRow>
//             <StyledGrid.Row>
//               <StyledGrid.Col col={12}>
//                 <FormButton
//                   text="Sign In"
//                   block
//                   isMakingRequest={isMakingRequest}
//                   data-test-id="signin__button"
//                 />
//               </StyledGrid.Col>
//             </StyledGrid.Row>
//           </form>
//         );
//       }}
//     />
//   );
// }

// export function SignIn() {
//   const [mutate, { status, data: requestResponse, error }] = useMutation(
//     async (values: Record<string, string>) =>
//       (await RequestService.post(`${BASE_AUTH_API_URL}/signin`, values)).data
//   );

//   const next = useNextRouteLocation();

//   if (requestResponse) {
//     // TODO handle remember
//     AuthService.setAuthToken(requestResponse.token);
//     return (
//       <Redirect
//         to={
//           next ||
//           NavigationService.getPathTo([
//             HomePath.prefix,
//             HomePath.paths.Dashboard,
//           ])
//         }
//       />
//     );
//   }

//   const doSignIn = async (values: Record<string, string>) => {
//     await mutate(values);
//   };

//   let warning: unknown = null;
//   let _error = error;
//   if (error && getResponseStatusCode(error) === 403) {
//     _error = null;
//     warning = (
//       <>
//         Account is not verified.
//         <Link
//           to={NavigationService.getPathTo([
//             AuthPath,
//             AuthPaths.ResendVerification,
//           ])}
//           style={{ color: "inherit", fontWeight: "bold" }}
//           data-test-id="signin__resend-verification-link"
//         >
//           &nbsp;Click me&nbsp;
//         </Link>
//         to resend verification mail or use one of the social login provider to
//         verify your account
//       </>
//     );
//   }

//   return (
//     <>
//       <ErrorAlert message={_error} />
//       {warning ? <WarningAlert message={warning} renderJsx /> : null}
//       <SignInPresentation
//         onSubmit={doSignIn}
//         isMakingRequest={status === QueryStatus.Loading}
//       />
//     </>
//   );
// }

// export default SignIn;

export const Foo = {};
