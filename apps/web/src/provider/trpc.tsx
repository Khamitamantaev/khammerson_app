import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "../trpc/client";
import { isTRPCClientError } from "../trpc/isTRPCClientError";
import { env } from "../lib/env";
import superjson from "superjson";

export const TrpcProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retryDelay: (retryCount) => Math.min(retryCount * 1000, 60 * 1000),
            retry(failureCount, error) {
              if (isTRPCClientError(error) && error.data?.httpStatus === 401) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            onError(error) {
              console.error("Mutation error:", error);
              if (isTRPCClientError(error)) {
                toast(error.message);
              }
            },
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => import.meta.env.DEV,
        }),
        httpBatchLink({
          url: env.VITE_API_URL, // 👈 теперь должно работать
          transformer: superjson,
          fetch: (input, init) => fetch(input, {
            ...init,
            credentials: "include",
          }),
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};