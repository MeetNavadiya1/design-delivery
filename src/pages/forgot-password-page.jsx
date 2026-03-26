import React from 'react'
import AuthLayout from '../Layouts/auth-layout'
import ForgotPasswordForm from '../components/forgot-password-form'

const ForgotPasswordPage = () => {
    return (
        <AuthLayout title="Forgot password" subtitle="Enter your email and we'll send you a reset link">
            <ForgotPasswordForm />
        </AuthLayout>
    )
}

export default ForgotPasswordPage;