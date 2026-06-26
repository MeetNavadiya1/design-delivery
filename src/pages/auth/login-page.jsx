import AuthLayout from "@/layout/auth-layout";
import LoginForm from "../../components/auth/login-form";

const LoginPage = () => {
  return (
    <AuthLayout title="Welcome Back" subtitle="Login to your Aurora account">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
