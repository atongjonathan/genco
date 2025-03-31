import { createFileRoute } from '@tanstack/react-router'
import Loading from '../components/Loading'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Loading/>
}
