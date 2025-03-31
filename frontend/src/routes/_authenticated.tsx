import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    // ✅ Read from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw redirect({ to: "/login" });
    }

    const user = JSON.parse(storedUser);
    

    

    return { user };
  },
});
