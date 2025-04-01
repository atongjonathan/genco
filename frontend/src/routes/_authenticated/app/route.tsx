import { createFileRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { Avatar, Button, Dropdown, DropdownGroup, DropdownItem, Icon, Layout, NavGroup, Navigation, NavItem } from '@nordhealth/react'
import { logout } from '@/AuthService'
import { useAuth } from '@/AuthContext'
import logo from "../../../assets/logo.png"
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app')({
    component: () => {
        const { pathname } = useLocation()
        const navigate = useNavigate()
        const { logout, user } = useAuth()
        if (!user) {
            return <Navigate to='/login' />
        }


        return (
            <Layout>
                <Navigation slot="nav" >

                    <Button slot='header' expand href='/'>
                        <Avatar src={logo} slot="start" name='Bath Clinic' variant='square'>GC</Avatar>
                        Genco Company</Button>


                    <NavItem >
                        <NavItem slot='subnav' active={pathname === "/app"} onClick={() => navigate({
                            to: "/app"
                        })}>
                            Dashboard

                        </NavItem>
                        <NavItem slot='subnav' active={pathname === "/app/livestock-data"} onClick={() => navigate({
                            to: "/app/livestock-data"
                        })}>
                            Data

                        </NavItem>

                        Livestock farmers registration

                    </NavItem>
                    <NavItem>
                        <NavItem slot='subnav' active={pathname === "/app/fodder"} onClick={() => navigate({
                            to: "/app/fodder"
                        })}>
                            Dashboard

                        </NavItem>
                        <NavItem slot='subnav' active={pathname === "/app/fodder-data"} onClick={() => navigate({
                            to: "/app/fodder-data"
                        })}>
                            Data

                        </NavItem>
                        Fodder farmers registration

                    </NavItem>


                    <NavItem>
                        <NavItem slot='subnav' active={pathname === "/app/hay"} onClick={() => navigate({
                            to: "/app/hay"
                        })}>
                            Hay Storage

                        </NavItem>
                        <NavItem slot='subnav' active={pathname === "/app/borehole"} onClick={() => navigate({
                            to: "/app/borehole"
                        })}>
                            Borehole Storage

                        </NavItem>
                        Infrastracture

                    </NavItem>

                    <NavItem active={pathname === "/app/capacity-data"} onClick={() => navigate({
                        to: "/app/capacity-data"
                    })}>
                        Capacity Building

                    </NavItem>
                    <NavItem active={pathname === "/app/off-take"} onClick={() => navigate({
                        to: "/app/off-take"
                    })}>
                        Livestock Offtake

                    </NavItem>
                    <NavItem active={pathname === "/app/fodder-offtake"} onClick={() => navigate({
                        to: "/app/fodder-offtake"
                    })}>
                        Fodder Offtake

                    </NavItem>

                    <NavItem>
                        <NavItem slot='subnav' active={pathname === "/app/users"} onClick={() => navigate({
                            to: "/app/users"
                        })}>
                            Users

                        </NavItem>
                        <NavItem slot='subnav' active={pathname === "/app/create-user"} onClick={() => navigate({
                            to: "/app/create-user"
                        })}>
                            Create User
                        </NavItem>
                        Manage Users
                    </NavItem>
                    <NavItem active={pathname === "/app/prices"} onClick={() => navigate({
                        to: "/app/prices"
                    })}>
                        Prices Management
                    </NavItem>
                    <NavItem active={pathname === "/app/upload"} onClick={() => navigate({
                        to: "/app/upload"
                    })}>
                        Upload
                    </NavItem>
                    <Dropdown expand slot="footer">
                        <Button variant="plain" slot="toggle" aria-describedby="periUser-tooltip" expand>
                            <Avatar slot="start" src={user.picture} aria-hidden="true" name="Laura Williams"></Avatar>
                            {user.name ?? user.email}
                        </Button>
                        <DropdownGroup>
                            <DropdownItem onClick={logout}>Sign Out
                                <Icon slot="end" name="interface-logout" />
                            </DropdownItem>

                        </DropdownGroup>
                    </Dropdown>
                </Navigation>
                <Outlet />

            </Layout>
        )
    }
})


