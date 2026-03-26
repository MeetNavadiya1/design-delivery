import React from 'react'
import { Mail, Lock } from 'lucide-react';
import Button from './common/button';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    return (
        <form action="" className='w-full'>
            <div className='flex flex-col gap-3'>
                <div>
                    <label htmlFor='email' className='text-gray-400 text-xs sm:text-sm'>Email</label>

                    <div className='flex items-center gap-2 p-2 sm:p-3 rounded-xl border border-gray-300'>
                        <Mail size={18} for="email" className='text-gray-400' />
                        <input
                            type="email"
                            id='email'
                            className='w-full focus:outline-none  placeholder:text-gray-400 text-sm'
                            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' placeholder='Enter Email' required />
                    </div>
                </div>

                <div>
                    <label htmlFor='password' className='text-gray-400 text-xs sm:text-sm'>Password</label>

                    <div className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'>
                        <Lock size={18} for="email" color='gray' />
                        <input
                            type="password"
                            id="password"
                            className='w-full focus:outline-none  text-sm placeholder:text-gray-400'
                            minLength={8}
                            placeholder='Enter Password' required />
                    </div>
                </div>
            </div>
            <div className='flex  justify-end my-2'>
                <Link to="/forgot-password"
                    className='text-xs  text-end text-primary hover:cursor-pointer hover:text-hover-primary'
                >
                    Forgot password?
                </Link>
            </div>
            <Button
                className='px-4 py-3 bg-primary hover:bg-hover-primary text-white text-sm w-full btn-class'
            >
                Login
            </Button>

            <p
                className='text-xs mt-5 text-center font-semibold'
            >
                Don't have an account?
                <Link to="/register" className='text-primary ml-1'>
                    Sign up
                </Link>
            </p>
        </form>
    )
}

export default LoginForm