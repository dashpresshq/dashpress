import noop from "lodash/noop";
import { useRouter } from "next/router";
import qs from "qs";
import { useEffect, useState } from "react";

export function useStateSyncedToUrl<T>(defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);

  const router = useRouter();

  useEffect(() => {
    const [_, query] = router.asPath.split("?");
    noop(_);
    if (!query) {
      return;
    }

    const queryState = qs.parse(query) as unknown as T;

    setState({
      ...queryState,
    });
  }, [router.asPath]);

  useEffect(() => {
    const [route] = router.asPath.split("?");

    const queryParams = `${qs.stringify(state)}`;

    /* Reat router hasn't finished loading */
    if (router.asPath.includes("[")) {
      return;
    }

    if (!queryParams) {
      return;
    }
    router.replace(`${route}?${queryParams}`);
  }, [JSON.stringify(state)]);

  return [state, setState] as const;
}
