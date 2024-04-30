import { AuthActions } from "./auth.actions";

export function useAuthenticateUser() {
  return (authToken: string, rememberMe: boolean) => {
    AuthActions.setAuthToken(authToken, rememberMe);

    AuthActions.signIn();
  };
}
