import { createStore } from "frontend/lib/store";

type IStore = {
  password?: string;
  setPassword: (password: string) => void;
};

export const usePasswordStore = createStore<IStore>((set) => ({
  password: "",
  setPassword: (password) =>
    set(() => ({
      password,
    })),
}));
