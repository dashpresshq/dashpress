export interface ISuccessfullAuthenticationResponse {
  token: string;
}

export interface ISetupCheck {
  hasDbCredentials: boolean;
  hasUsers: boolean;
}
