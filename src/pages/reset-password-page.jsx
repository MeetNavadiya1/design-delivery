import React from 'react'
import AuthLayout from '../Layouts/auth-layout'
import ResetPasswordForm from '../components/reset-password-form';

const ResetPasswordPage = () => {
    return (
        <AuthLayout title="Set new password" subtitle="Choose a strong password for your account">
            <ResetPasswordForm />
        </AuthLayout>
    )
}

export default ResetPasswordPage;