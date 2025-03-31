import { createFileRoute, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from "react";
import { Card, Stack, Button, Avatar, Banner, Layout, TopBar } from "@nordhealth/react";
import logo from '../assets/logo.png';
import { useQuery } from "@tanstack/react-query";
import { ParsedHistoryState } from '@tanstack/history';
import { sendOAuthRequest } from '../AuthService';

export const Route = createFileRoute('/logged-out')({
  component: RouteComponent,
})


function RouteComponent() {
  return <LoggedOut />
}


type OauthErrorState = ParsedHistoryState & {
    error: Error
  }
interface BannerInfo {
    variant: "warning" | "info" | "danger" | "success" | undefined;
    message: string;
}

const LoggedOut = () => {
    document.title = 'Not Permitted';

    // const state = useMatch({ from: '/logged-out' })
    const state = useLocation().state as unknown
    const ouathState = state as OauthErrorState
    const oathError = ouathState.error?.message

    const [loginError, setError] = useState<BannerInfo | null>(null);

    const { refetch, isFetching, error } = useQuery({
        queryKey: ["oauthRequest"],
        queryFn: () => sendOAuthRequest(),
        enabled: false
    })



    useEffect(() => {

        if (error) {
            setError({ variant: "danger", message: error.message });
        }
        else if(oathError){
          setError({ variant: "danger", message:oathError });

        }

    }, [error, oathError]);

    return (
        <Layout>
            <TopBar slot="top-bar" className="n-color-accent">
                <Button className="ml-10" variant="primary" onClick={() => refetch()}>Login</Button>
            </TopBar>

            <Stack className="login_stack">
                <Banner variant={loginError ? loginError.variant : "warning"}>
                    {loginError ? loginError.message : "Please sign in to continue"}
                </Banner>

                <Card padding="l">
                    <div className="logo" slot="header">
                        <Avatar className='n-color-background' size="l" variant='square' name="Peri Bloom" src={logo}>PB</Avatar>
                        <p>Not Permitted</p>
                    </div>
                    <p>Log in to access this page.</p>
                    <Button loading={isFetching} variant="primary" slot="footer" onClick={() => refetch()} expand>
                        Log in
                    </Button>
                </Card>
            </Stack>
        </Layout >
    );
};

export default LoggedOut;
