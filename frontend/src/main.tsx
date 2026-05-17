import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/AuthContext";
import { queryClient } from "@/api/queryClient";
import { AppRoutes } from "@/routes/AppRoutes";
import "@/styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "text-sm",
            duration: 3500,
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
