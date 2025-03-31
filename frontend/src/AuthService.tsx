import { UserManager } from 'oidc-client-ts';
import { backendConfig } from './oauth/config';

const userManager = new UserManager(backendConfig.settings);

export async function getUser() {
    const user = await userManager.getUser();
    return user;
}


export const handleOAuthCallback = async(callbackUrl: string) =>  await userManager.signinRedirectCallback(callbackUrl);
export const sendOAuthRequest = async ()=>  await userManager.signinRedirect();


export async function renewToken() {
    const user = await userManager.signinSilent();


    return user;
}

export async function logout() {
    console.log("log dout");
    
    await userManager.clearStaleState()
    await userManager.signoutRedirect();
}
export async function getAccessToken() {
    const user = await getUser();
    return user?.access_token;
}
export async function isAuthenticated() {
    let token = await getAccessToken();
    return !!token;
}