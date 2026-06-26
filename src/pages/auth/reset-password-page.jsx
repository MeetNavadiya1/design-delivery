import AuthLayout from "@/layout/auth-layout";
import ResetPasswordForm from "../../components/auth/reset-password-form";


const ResetPasswordPage = () => {
    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your new password.">
            <ResetPasswordForm />
        </AuthLayout>
    )
}

export default ResetPasswordPage
