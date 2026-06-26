import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "@/schema/auth-schema";
import { authServices } from "../../services/auth-services";
import { toast } from "sonner";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data) {
    setLoading(true);
    try {
      const res = await authServices.loginUser(data);

      if (res?.success) {
        const token = res?.data?.token;

        if (token) {
          localStorage.setItem("token", token);
        }

        navigate("/agency/dashboard");
        toast.success(res?.message || "Login successful");
      }
    } catch (error) {
      const errorMessage = error?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      id="form-login"
      className="grid gap-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-login-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Email"
                  autoComplete="email"
                  type="email"
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center">
                {" "}
                <FieldLabel htmlFor="form-login-password">Password</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-login-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                />
                <InputGroupAddon>
                  <Lock />
                </InputGroupAddon>
                <InputGroupAddon
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer"
                  align="inline-end"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button className="w-full mt-3" type="submit" size="lg">
        {loading ? "Loading..." : "Login"}
      </Button>

      <p className="text-center">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="cursor-pointer text-primary font-medium hover:text-primary/90 transition-colors duration-300 hover:underline underline-offset-2"
        >
          Register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
