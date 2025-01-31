import React, { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../../Utils/AuthContext";
import Input from "../Input";
import Button from "../Button";

const LoginForm = () => {
  const [userLogin, setUserLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserLogin((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(userLogin);
    } catch (error) {
      console.error(error.message);
      setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen">
      <h1 className="text-3xl font-bold">Login Devcom</h1>
      <div className="max-w-5xl w-1/2 p-8 flex justify-center items-center gap-5 flex-col bg-dark shadow-md rounded-2xl my-16 border-secondary border-[1px]">
        <h1 className="inline-flex items-center text-2xl mb-4 flex-col">
          <LockClosedIcon className="h-8 w-8 mb-2" /> Login
        </h1>
        
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 w-full">
          <Input
            placeholder="Enter your username..."
            name="username"
            value={userLogin.username}
            autoComplete="username"
            onChange={handleOnChange}
          />

          <Input
            placeholder="Enter your password..."
            name="password"
            type="password"
            value={userLogin.password}
            autoComplete="current-password"
            onChange={handleOnChange}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" disabled={!userLogin.username || !userLogin.password}>
            Login
          </Button>
        </form>

        <small className="text-zinc-900">
          Don&apos;t have an account? {" "}
          <a className="text-blue-700 hover:underline" href="/register">
            Register
          </a>
        </small>
      </div>
    </div>
  );
};

export default LoginForm;
