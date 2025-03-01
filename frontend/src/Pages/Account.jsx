import React, { useState, useEffect } from "react";
import { requestHandler } from "../Utils/app";
import { updateAccountDetails, updateAvatar, updatePassword, fetchUserAllInfo } from "../Api/api";

const Account = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestHandler(
      fetchUserAllInfo,
      setLoading,
      (res) => {
        setUser(res.data.userData);
        setName(res.data.userData.name);
      },
      (error) => console.error("Error fetching user data:", error)
    );
  }, []);

  const handleUpdateDetails = () => {
    requestHandler(
      () => updateAccountDetails({ name }),
      setLoading,
      () => alert("Account details updated successfully!"),
      (error) => console.error("Update error:", error)
    );
  };

  const handleUpdateAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    
    requestHandler(
      () => updateAvatar(formData),
      setLoading,
      () => alert("Avatar updated successfully!"),
      (error) => console.error("Avatar update error:", error)
    );
  };

  const handleUpdatePassword = () => {
    requestHandler(
      () => updatePassword({ password }),
      setLoading,
      () => alert("Password updated successfully!"),
      (error) => console.error("Password update error:", error)
    );
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleUpdateDetails} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Update Name
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Change Avatar</label>
        <input type="file" onChange={handleUpdateAvatar} className="w-full p-2 border rounded" />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleUpdatePassword} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Account;
