import { useRouter } from "next/router";
import { SLUG_LOADING_VALUE } from "./constants";
// TODO nuke this for useRouteParams
export function useSlug(name: string) {
  const router = useRouter();

  if (typeof window === "undefined") return SLUG_LOADING_VALUE;

  const value = router.query[name];

  if (!value) return SLUG_LOADING_VALUE;

  if (Array.isArray(value))
    throw new Error("Unexpected handle given by Next.js");
  return value;
}
