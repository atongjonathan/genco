import { ReactNode, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoggedOut from "./LoggedOut";
import Loading from "../Loading";
import { handleOAuthCallback } from "../../AuthService";


function OAuthCallback(): ReactNode {
    // rerendering the components does not change isProcessed, but remounting the component does change.
    const isProcessed = useRef(false);
    const currentUrl = window.location.href;
    const [enable, setenable] = useState(false);
    const [error, setError] = useState<string | null>(null);
    let location = localStorage.getItem("location");
    console.log(location);


    const { data, refetch} = useQuery({
        queryKey: ["oauthCallback"],
        queryFn: () => handleOAuthCallback(currentUrl),
        enabled: enable
    })




    useEffect(() => {
        async function processOAuthResponse() {
            if (isProcessed.current) {
                return;
            }

            isProcessed.current = true;
            refetch()
            setenable(true)
        }

        processOAuthResponse();
    }, [])

    if (error) return <LoggedOut Oerror={error} />
    return <Loading />
}

export default OAuthCallback;