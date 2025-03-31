import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Card, Stack, Button, Avatar, Input, Banner, Header, Layout } from "@nordhealth/react";
import logo from "../assets/logo.png";
import { useState } from "react";
import { signin } from "@/data"; // Firebase login function
import { useAuth, User } from "@/AuthContext";
import { useMutation } from "@tanstack/react-query"; // ✅ Import useMutation
import { DocumentData } from "firebase/firestore";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login, user } = useAuth(); // Get login function from Auth Context
  if (user) return <Navigate to="/app" />
  const navigate = useNavigate(); // Get navigation function
  const [loginError, setLoginError] = useState<{ message: string; variant: "danger" | "warning" | "success" } | null>(null);

  document.title = "Login"


  // ✅ Manage form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement
     
    setFormData({ ...formData, [input.name]: input.value });
  };

  // ✅ useMutation for handling login
  const mutation = useMutation({
    mutationFn: async () => {
      return signin(formData.email, formData.password);
    },
    onSuccess: (userCredential:DocumentData) => {
      
      login(userCredential as User); // ✅ Update Auth Context      
      navigate({ to: "/app" }); // ✅ Redirect user after login
    },
    onError: (error) => {
      setLoginError({ message: error instanceof Error ? error.message : "An error occurred", variant: "danger" });

      // ✅ Set error state on failure
      mutation.reset();
    },
  });

  return (
    <main className="min-h-[100vh] main" style={{background: 'url("https://images.pexels.com/photos/1011630/pexels-photo-1011630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")', backgroundSize:'fill', backgroundRepeat:"no-repeat", backgroundPosition:'90% 30%'}}>


      <form className="w-96" onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(); // ✅ Trigger login
      }}>
        <Stack className="login_stack">
          {/* ✅ Show error message if login fails */}
          {loginError && !mutation.isPending && <Banner variant={loginError.variant}>{loginError.message}</Banner>}

          <Card padding="l">
            {/* Logo */}
            <div className="logo" slot="header">
              <Avatar className="n-color-background" size="l" variant="square" name="Peri Bloom" src={logo}>
                PB
              </Avatar>
              <p>Login</p>
            </div>
            <Stack>
              <Input label="Email" type="email" name="email" value={formData.email} onInput={handleChange} expand required />
              <Input label="Password" type="password" name="password" value={formData.password} onInput={handleChange} expand required />
            </Stack>
            {/* Inputs */}


            {/* Submit Button with loading state */}
            <Button type="submit" variant="primary" slot="footer" expand loading={mutation.isPending}>
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Card>
        </Stack>
      </form>
    </main>

  );
}
