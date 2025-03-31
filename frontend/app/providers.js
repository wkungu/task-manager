  "use client";

  import { SessionProvider } from "next-auth/react";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { Provider } from "react-redux";
  import { store } from "@/store/index";

  const queryClient = new QueryClient();

  export default function Providers({ children }) {
    return (
      <SessionProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
      </SessionProvider>
    );
  }
