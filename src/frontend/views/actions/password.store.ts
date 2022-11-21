import { createStore } from "@hadmean/protozoa";

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
