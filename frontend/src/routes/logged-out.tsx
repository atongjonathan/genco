import { createFileRoute, useLocation } from '@tanstack/react-router'
import LoggedOut from '../components/auth/LoggedOut'
import { ParsedHistoryState } from '@tanstack/history';


export const Route = createFileRoute('/logged-out')({
  component: RouteComponent,
})

type OauthErrorState = ParsedHistoryState & {
  error: Error
}

function RouteComponent() {

  // const state = useMatch({ from: '/logged-out' })
  const state = useLocation().state as unknown
  const ouathState = state as  OauthErrorState
  return <LoggedOut error={ouathState.error} />
}
