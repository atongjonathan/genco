import { createRootRouteWithContext, Link, Outlet, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'


export const Route = createRootRouteWithContext()({

    component: () => (
        <Outlet />
        // {/* <TanStackRouterDevtools /> */}
    ),
})