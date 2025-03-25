import { useEffect, useState } from "react";
import { Card, Stack, Button, Avatar, Banner, Layout, TopBar } from "@nordhealth/react";
import logo from '../../assets/logo.png';
import { sendOAuthRequest } from "../../AuthService";
import { SigninRedirectArgs } from "oidc-client-ts";

interface BannerInfo {
    variant: "warning" | "info" | "danger" | "success" | undefined;
    message: string;
}

const LoggedOut = ({ error }: { error?: Error }) => {
    document.title = 'Not Permitted';

    const [loading, setLoading] = useState(false);
    const [loginError, setError] = useState<BannerInfo | null>(null);

    const handleLogin = async () => {
        try {
            setLoading(true); // Start loading
            sendOAuthRequest()
            setLoading(false); // Stop loading after successful redirect
        } catch (err) {
            setLoading(false);
            setError({ variant: "danger", message: "Login failed. Please try again." });
            console.error("Login Error:", err);
        }
    };

    useEffect(() => {
        console.log(error);
        

        if (error) {
            setError({ variant: "danger", message: error.message });
        }

    }, [error]);

    return (
        <Layout>
            <TopBar slot="top-bar" className="n-color-accent">
                <Button className="ml-10" variant="primary" onClick={sendOAuthRequest}>Login</Button>
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
                    <Button loading={loading} variant="primary" slot="footer" onClick={handleLogin} expand>
                        Log in
                    </Button>
                </Card>
            </Stack>
        </Layout >
    );
};

export default LoggedOut;
