import AuthLayout from "../../layout/auth-layout";
import RegisterForm from "../../components/auth/register-form";

const RegisterPage = () => {
  return (
    <AuthLayout title="Create Account">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
