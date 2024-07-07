import { useEffect } from "react";

import { getBestErrorMessage } from "@/frontend/lib/toast/utils";
import { fakeMessageDescriptor } from "@/translations/fake";

import { toast } from "./use-toast";

export const useToastActionQueryError = (error: unknown, condition = true) => {
  useEffect(() => {
    if (error && condition) {
      toast({
        description: fakeMessageDescriptor(getBestErrorMessage(error)),
        variant: "red",
      });
    }
  }, [error, condition]);
};
