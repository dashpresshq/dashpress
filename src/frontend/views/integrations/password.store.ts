import { createStore } from "@hadmean/protozoa";

type IStore = {
  password?: string;
  isPasswordValid: boolean;
  setPassword: (password: string) => void;
  setIsPasswordValid: () => void;
};

export const usePasswordStore = createStore<IStore>((set) => ({
  password: "",
  isPasswordValid: false,
  setIsPasswordValid: () =>
    set(() => ({
      isPasswordValid: true,
    })),
  setPassword: (password) =>
    set(() => ({
      password,
    })),
}));
