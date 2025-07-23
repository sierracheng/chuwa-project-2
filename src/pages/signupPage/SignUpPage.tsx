import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { PASSWORD_REGEX } from "../../utils/util";
import { createSimpleUserAPI } from "../../back-end/api/userAPI";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().regex(PASSWORD_REGEX, "Invalid password input"),
  confirm_password: z.string().min(1, "Confirm password is required"),
  email: z.email("Invalid email address"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});


export function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [signupSuccess, setSignupSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirm_password: "",
      email: email || "",
    },
  });


  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const userData = {
      token: token || '',
      username: data.username,
      password: data.password,
      email: data.email,
    };

    try {
      const response = await createSimpleUserAPI(userData);
      // console.log(response.success);
      if (response.success) {
        setSignupSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute fixed inset-0">
        <img
          src="/images/signup-bg.png"
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/50 backdrop-blur-sm"></div>
        <img
          src="/images/LargeLogo.png"
          alt="Logo"
          className="absolute top-0 left-0 h-12 w-auto mt-4 ml-4 sm:h-20"
        />
      </div>
      <div className='relative z-10 flex min-h-screen items-center justify-center px-4'>
        <Card className="w-full max-w-md p-6 h-[500px] flex flex-col  items-center justify-center">
          {signupSuccess && (
            <div className="mb-4 rounded-md border border-green-500 bg-green-50 p-4 text-green-700 text-center font-medium">
              🎉 Account created! Redirecting to login page...
            </div>
          )}
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Register an account</h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 w-full flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-[#2D68FE]">
                Sign Up
              </Button>

            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
