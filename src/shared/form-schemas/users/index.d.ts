export type ICreateUserForm = {
  name: string;
  username: string;
  role: string;
  password: string;
};

export type IUpdateUserForm = {
  name: string;
  role: string;
};
