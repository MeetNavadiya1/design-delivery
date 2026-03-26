import React from 'react'
import { Mail, ArrowLeft } from 'lucide-react';
import Button from './common/button';
import { Link } from 'react-router-dom';


const ForgotPasswordForm = () => {
    return (
        <form action="" className='w-full'>
            <div className='flex flex-col gap-2'>
                <div>
                    <label htmlFor='email' className='text-gray-400 text-sm'>Email</label>
                    <div className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'>
                        <Mail size={18} color='gray' />
                        <input type="email" id='email' className='w-full focus:outline-none placeholder:text-gray-400 ' pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' placeholder='Enter Email' required />
                    </div>
                </div>
            </div>

            <Button className='px-4 py-3 bg-primary hover:bg-hover-primary text-white text-sm w-full btn-class mt-3'>Send Reset Link</Button>
            <p className='text-xs mt-5 text-center font-semibold'>
                <Link to="/login" className='text-primary flex items-center justify-center'>
                    <ArrowLeft className='w-4' />
                    <p> Back to login</p>
                </Link>
            </p>
        </form>
    )
}

export default ForgotPasswordForm;