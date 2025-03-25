const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const POST_LOGOUT_REDIRECT_URI = import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI;


const backendSettings = {
    authority: BACKEND_URL + '/api/o',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    silent_redirect_uri: REDIRECT_URI,
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT_URI,
    response_type: 'code',
    scope: 'read write openid'
};


export const backendConfig = {
    settings: backendSettings,
    flow: 'backend'
};