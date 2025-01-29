import React, { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import Input from '../Input';
import Button from '../Button';
import { useAuth } from '../../Utils/AuthContext';

const RegisterForm = () => {
    const { register } = useAuth();

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        fullname: "",
        password: "",
        avatar: null
    });

    const [error, setError] = useState("");


    const handleRegistration = (e) => {
        const { name, value, files } = e.target;

        setRegisterData(prevDetails => ({
            ...prevDetails,
            [name]: name === "avatar" ? files[0] : value
        }));
        // console.log(setRegisterData)
    };


    const handleOnRegister = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();


            Object.keys(registerData).forEach(key => {
                formData.append(key, registerData[key]);
            });


            await register(formData);
            console.log(formData)
            console.log(register)

        } catch (error) {
            console.log(error.message || error)
            if (error.response && error.response.data) {
                setError(error.response.data.message);  // Handle specific API error message
            } else {
                setError("Something went wrong while registering. Please check all fields are filled correctly.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center flex-col h-screen w-screen">
            <h1 className="text-3xl font-bold">Register to Devcom</h1>
            <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
                <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
                    <LockClosedIcon className="h-8 w-8 mb-2" /> Register
                </h1>

                {error && <p className="text-red-500">{error}</p>}

                <Input
                    placeholder="Enter the email..."
                    type="email"
                    value={registerData.email}
                    onChange={handleRegistration}
                    name="email"
                />
                <Input
                    placeholder="Enter the username..."
                    value={registerData.username}
                    onChange={handleRegistration}
                    name="username"
                />
                <Input
                    placeholder="Enter the full name..."
                    value={registerData.fullname}
                    onChange={handleRegistration}
                    name="fullname"
                />
                <Input
                    placeholder="Enter the password..."
                    type="password"
                    value={registerData.password}
                    onChange={handleRegistration}
                    name="password"
                />
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleRegistration}
                    className="text-sm text-gray-500"
                    name="avatar"
                />

                {/* Register button */}
                <Button
                    disabled={Object.values(registerData).some((val) => val === "" || val === null)}
                    onClick={handleOnRegister}
                >
                    Register
                </Button>

                {/* Login link */}
                <small className="text-zinc-300">
                    Already have an account?{" "}
                    <a className="text-primary hover:underline" href="/login">
                        Login
                    </a>
                </small>
            </div>
        </div>
    );
};

export default RegisterForm;
