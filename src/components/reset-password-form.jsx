import React from 'react'
import { Lock, ArrowLeft } from 'lucide-react';
import Button from './common/button';
import { Link } from 'react-router-dom';


const ResetPasswordForm = () => {
    return (
        <form action="" className='w-full'>
            <div className='flex flex-col gap-2 my-2'>
                <div>
                    <label htmlFor='password' className='text-gray-400 text-sm'>New Password</label>
                    <div className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'>
                        <Lock size={18} color='gray' />
                        <input type="password" id='password' className='w-full focus:outline-none  placeholder:text-gray-400' placeholder='Enter new password' required />
                    </div>
                </div>

                <div>
                    <label htmlFor='confirmPassword' className='text-gray-400 text-sm'>Confirm Password</label>
                    <div className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'>
                        <Lock size={18} color='gray' />
                        <input type="password" id="confirmPassword" className='w-full focus:outline-none placeholder:text-gray-400' minLength={8} placeholder='Enter Confirm password' required />
                    </div>
                </div>
            </div>

            <Button className='px-4 py-3 bg-primary hover:bg-hover-primary text-white text-sm w-full btn-class'>Send New Password</Button>
            <p className='text-xs mt-5 text-center font-semibold'>
                <Link to="/login" className='text-primary flex items-center justify-center hover:text-hover-primary'>
                    <ArrowLeft className='w-4' />
                    <p> Back to login</p>
                </Link>
            </p>
        </form>
    )
}

export default ResetPasswordForm;