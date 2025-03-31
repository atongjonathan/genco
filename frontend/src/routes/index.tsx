import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    throw redirect({ to: "/app" });
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/"!</div>
}
