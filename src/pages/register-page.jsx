import React from 'react'
import AuthLayout from '../Layouts/auth-layout'
import RegisterPageForm from '../components/register-page-form'

const RegisterPage = () => {
    return (
        <AuthLayout>
            <RegisterPageForm />
        </AuthLayout>
    )
}

export default RegisterPage