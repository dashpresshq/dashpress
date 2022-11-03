export interface ISuccessfullAuthenticationResponse {
  token: string;
}

export interface ISetupCheck {
  hasDbCredentials: boolean;
  hasUsers: boolean;
}

export const FOR_CODE_COV = 1;
