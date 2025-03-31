import { Card, Stack, Button, Input, Select, Banner, Header } from "@nordhealth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, registerUser } from "@/data";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/app/create-user")({
  component: RouteComponent,
});

function RouteComponent() {
  //  Manage form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "android-user",
  });

  document.title = "Create User"


  const [loginError, setLoginError] = useState<{ message: string; variant: "danger" | "warning" | "success" } | null>(null);

  // ✅ Handle input changes
  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    setFormData({ ...formData, [input.name]: input.value });
  };

  // ✅ Define the mutation for registering a user
  const mutation = useMutation({
    mutationFn: async () => {
      // Register user in Firebase
      const userCredential = await registerUser(formData);
      const user = userCredential;

      // Save user details in Firestore
      await addDoc(collection(db, "users"), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: "Active",
        createdAt: new Date(),
      });

      return user; // Return user data on success
    },
    onSuccess: () => {
      setLoginError({ message: "User registered successfully!", variant: "success" });
      setFormData({ name: "", email: "", password: "", role: "android-user" }); // Reset form
    },
    onError: (error) => {
      setLoginError({ message: error instanceof Error ? error.message : "An error occurred", variant: "danger" });
    },
  });

  return (
    <>
      <Header slot="header"><h1 className='n-typescale-m font-semibold'>Create User</h1></Header>
      <form
        onSubmit={(e) => {
          setLoginError(null)
          e.preventDefault();
          let values = Object.values(formData)
          let valid = (values.findIndex((value) => !value)) === -1

          if (valid) {
            mutation.mutate();

          }
          else {
            setLoginError({ message: "Please fill all required fields ", variant: "danger" });

          }
        }}
      >
        <Stack>
          {/* Show error/success message */}
          {loginError && !mutation.isPending && <Banner variant={loginError.variant}>{loginError.message}</Banner>}

          <Card padding="l" >
            <section className="n-grid-2">
              <Input label="Name" type="text" name="name" value={formData.name} onInput={handleChange} expand required />
              <Input label="Email" type="email" name="email" value={formData.email} onInput={handleChange} expand required />
              <Input label="Password" type="password" name="password" value={formData.password} onInput={handleChange} expand required />

              {/* Role Selection */}
              <Select title="Role" name="role" label="Role" value={formData.role} onInput={handleChange} expand required>
                <option value="android-user">Android User</option>
                <option value="admin">Admin</option>
                <option value="chief-admin">Chief Admin</option>
              </Select>
            </section>


            {/* Inputs */}


            {/* Submit Button */}
            <Button type="submit" variant="primary" slot="footer" loading={mutation.isPending}>
              {mutation.isPending ? "Creating User..." : "Submit"}
            </Button>
          </Card>
        </Stack>
      </form>
    </>


  );
}
