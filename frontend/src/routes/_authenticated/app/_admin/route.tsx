import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/_admin')({
  beforeLoad: () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== "chief-admin") {        
        throw redirect({ to: "/app" });
      }

    }

  }
})


