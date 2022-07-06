import { useRouter } from 'next/router';

export const upsertRouterPathQueryWithValue = (path: string, key: string, newValue: string) => {
  const [route, query = ''] = path.split('?');
  const querySplit = query.split('&');
  const queryIndex = querySplit.findIndex((chunk) => chunk.split('=')[0] === key);
  const newQueryValue = `${key}=${newValue}`;
  if (queryIndex === -1) {
    querySplit.push(newQueryValue);
  } else {
    querySplit.splice(queryIndex, 1, newQueryValue);
  }

  return `${route}?${querySplit.filter((x) => x).join('&')}`;
};

export const useChangeRouterParam = (key: string) => {
  const router = useRouter();
  return (newValue: string) => {
    router.replace(upsertRouterPathQueryWithValue(router.asPath, key, newValue));
  };
};
