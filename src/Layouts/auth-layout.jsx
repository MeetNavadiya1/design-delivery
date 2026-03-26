import React from 'react'
import logo from "../assets/DDLogoFull.png"

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div
            className=' bg-gray-100 min-h-screen flex justify-center items-center px-4'
        >
            <div
                className=' w-full max-w-md bg-white p-5 sm:p-7 flex flex-col  items-center rounded-2xl shadow-xl gap-4'
            >
                <img
                    src={logo}
                    alt="logo"
                    className='w-24 sm:w-28 md:w-32'
                />
                <div
                    className='text-center'
                >
                    <h2
                        className='text-subheading font-semibold'
                    >
                        {title}
                    </h2>
                    <p
                        className='text-xs dsm:text-sm text-gray-500'
                    >
                        {subtitle}
                    </p>
                </div>

                <div
                    className='w-full'
                >
                    {children}
                </div>
            </div>
        </div>
    )
};

export default AuthLayout;