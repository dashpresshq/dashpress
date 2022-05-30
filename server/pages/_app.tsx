import { AppWrapper } from "@gothicgeeks/design-system";
import { QueryClientProvider, QueryClient } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
    </AppWrapper>
  );
}

export default MyApp;
