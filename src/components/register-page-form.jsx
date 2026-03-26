import React, { useState } from 'react'
import Button from './common/button';
import { Link } from "react-router-dom"
import { Lock, Camera, Building2, Mail, User } from 'lucide-react';

const RegisterPageForm = () => {
    const [accountType, setAccountType] = useState("agency");

    return (
        <form action="" className='w-full'>

            <div className="flex justify-between mb-4 w-full bg-gray-100 rounded-xl">
                <Button
                    children="Agency Admin"
                    type="button"
                    onClick={() => setAccountType("agency")}
                    className={`px-4 flex-1 py-2 text-gray-500 text-sm cursor-pointer duration-300 shadow-none transition-colors ${accountType === "agency" ? "bg-primary text-white" : ""}`}
                />

                <Button
                    children="Client"
                    type="button"
                    onClick={() => setAccountType("client")}
                    className={`px-4  flex-1 py-2 text-gray-500 text-sm cursor-pointer duration-300 transition-colors shadow-none 
                    ${accountType === "client" ? "bg-primary text-white" : ""}`}
                />
            </div>

            {/* Profile picture */}
            <div
                className="mb-1 flex flex-col items-center gap-2"
            >
                <div
                    className="w-18 h-18 rounded-full border-2 border-dashed border-primary flex items-center justify-center overflow-hidden cursor-pointer hover:border-hover-primary hover:bg-gray-200 transition relative group bg-purple-50"
                >
                    {accountType === "agency" ? (
                        <Building2
                            className="text-primary group-hover:opacity-0" size={24}
                        />
                    ) : (
                        <User
                            className="text-primary group-hover:opacity-0"
                            size={24}
                        />
                    )}
                    <div
                        className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                    >
                        <Camera
                            className="text-white"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className="text-xs text-primary  hover:text-hover-primary"
                >
                    Set profile picture
                </button>
            </div>

            <div className='flex flex-col gap-2'>
                <div>
                    <label
                        htmlFor='text'
                        className='text-gray-400 text-sm'
                    >
                        {accountType === "agency" ? "Agency name" : "Client name"}
                    </label>
                    <div
                        className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'>
                        {accountType === "agency" ? (
                            <Building2 size={18} color='gray' />
                        ) : (
                            <User size={18} color='gray' />
                        )}
                        <input
                            type="text"
                            id='text'
                            className='w-full focus:outline-none  placeholder:text-gray-400'
                            placeholder={accountType === "agency" ? "Agency name" : "Client name"} required />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor='email'
                        className='text-gray-400'
                    >
                        Email
                    </label>
                    <div
                        className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'>
                        <Mail
                            size={18}
                            color='gray' />
                        <input
                            type="email"
                            id="email"
                            className='w-full focus:outline-none placeholder:text-gray-400'
                            pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' placeholder={accountType === "agency" ? "Agency email" : "Client email"}
                            required
                        />
                    </div>
                </div>

                {accountType === "client" ? (
                    <div>
                        <label
                            htmlFor='ContactPersonName'
                            className='text-gray-400 text-sm'
                        >
                            Contact Person Name
                        </label>
                        <div
                            className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'
                        >
                            <User
                                size={18}
                                color='gray'
                            />
                            <input
                                type="text"
                                id='ContactPersonName'
                                className='w-full focus:outline-none placeholder:text-gray-400'
                                placeholder='Enter contect person name'
                                required
                            />
                        </div>
                    </div>
                ) : (
                    ""
                )}

                <div>
                    <label
                        htmlFor='password'
                        className='text-gray-400 text-sm'
                    >
                        New Password
                    </label>
                    <div
                        className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'
                    >
                        <Lock
                            size={18}
                            color='gray'
                        />
                        <input
                            type="password"
                            id='password'
                            className='w-full focus:outline-none placeholder:text-gray-400'
                            placeholder='Enter new password'
                            required
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor='confirmPassword'
                        className='text-gray-400 text-sm'
                    >
                        Confirm Password
                    </label>
                    <div
                        className='flex items-center gap-2 p-3 rounded-xl border border-gray-300'
                    >
                        <Lock
                            size={18}
                            color='gray' />
                        <input
                            type="password"
                            id="confirmPassword"
                            className='w-full focus:outline-none placeholder:text-gray-400' minLength={8}
                            placeholder='Enter Confirm password'
                            required
                        />
                    </div>
                </div>

                <div>
                    <Button
                        className='px-4 py-4 bg-primary hover:bg-hover-primary text-white text-sm w-full btn-class'
                    >
                        {accountType === "agency" ? "Create Agency Account" : "Create Client Account"}
                    </Button>
                    <p
                        className='text-xs mt-5 text-center font-semibold'
                    >
                        Alredy have an account?
                        <Link
                            to="/login"
                            className='text-primary ml-1'
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </form >
    )
}

export default RegisterPageForm