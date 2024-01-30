export type ICreateUserForm = {
  name: string;
  username: string;
  role: string;
  password: string;
  systemProfile: string;
};

export type IUpdateUserForm = {
  name: string;
  role: string;
  systemProfile: string;
};

export const FOR_CODE_COV = 1;
