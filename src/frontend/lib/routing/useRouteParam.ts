import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useRouter } from "next/router";

export function useRouteParam(name: string) {
  const router = useRouter();

  if (typeof window === "undefined") return SLUG_LOADING_VALUE;

  const value = router.query[name];

  if (!value) return SLUG_LOADING_VALUE;

  if (Array.isArray(value))
    throw new Error("Unexpected handle given by Next.js");
  return value;
}
