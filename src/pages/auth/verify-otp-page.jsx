import VerifyOtpForm from "../../components/auth/verify-otp-form";
import AuthLayout from "../../layout/auth-layout";

const VerifyOtpPage = () => {
    return (
        <AuthLayout title="Verify OTP" subtitle="Enter the OTP sent to your email">
            <VerifyOtpForm />
        </AuthLayout>
    );
};

export default VerifyOtpPage;