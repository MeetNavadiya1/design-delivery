import AuthLayout from "@/layout/auth-layout";
import ForgotPasswordForm from "../../components/auth/forgot-password-form";

const ForgotPasswordPage = () => {
    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email and we'll send you a link to reset it.">
            <ForgotPasswordForm />
        </AuthLayout>
    )
}

export default ForgotPasswordPage
