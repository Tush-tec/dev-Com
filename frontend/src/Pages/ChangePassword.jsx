import React, { useState } from "react";
import { updatePassword } from "../Api/api";
import { useNavigate } from "react-router-dom";
import { KeyIcon } from "@heroicons/react/24/outline";
import Loader from "../Components/Loader";
import { requestHandler } from "../Utils/app";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";


const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [onSuccess, setOnSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOnSuccess(false);

    const { oldPassword, newPassword, confirmPassword } = formData;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and Confirm password must match!");
      return;
    }

    // Use requestHandler to make the API request
    await requestHandler(
      () => updatePassword(formData), // API call function
      setLoading, // Loading state handler
      (data) => {
        setOnSuccess(true);
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

        setTimeout(() => navigate("/profile"), 2000);
      },
      setError // Error handler
    );
  };

  return (
    <>
    <HeaderPage/>
    <div className="max-w-md mx-auto mt-10 bg-[#162130] text-white p-6 rounded-lg shadow-lg mb-10">
    <h1 className="flex flex-col items-center justify-center text-2xl mb-4 text-white">
  <KeyIcon className="h-8 w-8 mb-2 text-white" />
  Click to confuse yourself later_ !
</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {onSuccess && <p className="text-green-500 text-center">Password changed successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-gray-800 rounded-md border border-gray-700 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-400">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-gray-800 rounded-md border border-gray-700 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-400">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-gray-800 rounded-md border border-gray-700 focus:border-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-md mt-4 "
          disabled={loading}
        >
          {loading ? <Loader /> : "Change Password"} {/* Use Loading component */}
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default ChangePassword;
