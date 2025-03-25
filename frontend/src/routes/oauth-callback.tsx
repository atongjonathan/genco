import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { handleOAuthCallback } from '../AuthService';
import Loading from '../components/Loading';

export const Route = createFileRoute('/oauth-callback')({
  component: RouteComponent,
});

function RouteComponent() {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await handleOAuthCallback(location.href);
        console.log(response);
        setRedirectTo('/');
      } catch (err) {
        setError(err);
        setRedirectTo('/');
      }
    })();
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} state={(prev) => ({ ...prev, error })} />;
  }

  return <Loading />;
}
