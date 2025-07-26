import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/Card/Card";
import { PASSWORD_REGEX } from "../../utils/util";
import { findUserAPI } from "../../back-end/api/userAPI";
import { useDispatch } from "react-redux";
import {
  setIsLogin,
  setRole,
  setId,
} from "@/redux/features/authenticate/authenticateSlice";
import Background from "@/components/Background";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().regex(PASSWORD_REGEX, "Invalid password input"),
});

export function LoginPage() {
  const navigate = useNavigate();

  const [loginSuccess, setLoginSuccess] = useState(false);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const userData = {
      username: data.username,
      password: data.password,
    };

    const response = await findUserAPI(userData);

    if (response.success) {
      const userId = response.token.replace("mock-token-", "");
      
      console.log('extract UserId:', userId);// Assuming the response contains user ID
      setLoginSuccess(true);
      dispatch(setIsLogin(true));
      dispatch(setRole(response.user.role));
      dispatch(setId(userId)); // Use the extracted userId
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user._id);
      if (response.user.role === "HR") {
        navigate("/hr/homepage");
      } else {
        navigate("/employee/homepage");
      }
    } else {
      alert(response.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col relative w-full min-h-screen overflow-hidden">
      <div className="inset-0">
        <Background />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <Card className="w-full min-h-[400px] max-w-md p-6 flex flex-col items-center justify-center ">
          {loginSuccess && (
            <div className="mb-4 rounded-md border border-green-500 bg-green-50 p-4 text-green-700 text-center font-medium">
              🎉 Login success! Redirecting to home page...
            </div>
          )}
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            Sign in to your account
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 w-full flex flex-col gap-5"
            >
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

              <Button type="submit" className="w-full bg-[#2D68FE]">
                Sign In
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
