import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    // ✅ Read from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.assign("/login")
      return
    }

    const user = JSON.parse(storedUser);
    if (user.role === "android-user") {
      localStorage.removeItem("user")
      window.location.assign("/login")
    }





    return { user };
  },
});
