import { createFileRoute, redirect } from '@tanstack/react-router'

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
    beforeLoad: async ({ context }) => {
        const userManager = context.userManager
        const user = await userManager.getUser()
        const isAuthenticated = (user?.expires_at ?? Date.now() / 1000) - Date.now() / 1000 > 0
        if (!isAuthenticated) {
            throw redirect({
                to: '/logged-out',
            })
        }
        return user
    },
})