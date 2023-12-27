import { useRouter } from "next/router";

export function useRouteParam(name: string) {
  const router = useRouter();

  const value = router.query[name] || "";

  if (Array.isArray(value))
    throw new Error("Unexpected handle given by Next.js");
  return value;
}

export function useRouteParams() {
  const router = useRouter();

  if (typeof window === "undefined") return {};

  const value = router.query;

  if (Array.isArray(value))
    throw new Error("Unexpected handle given by Next.js");
  return value;
}
