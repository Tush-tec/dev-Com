import React, { useEffect, useState } from "react";
import { fetchUser, getALLUserInfo, updateAvatar } from "../Api/api";
import { jwtDecode } from "jwt-decode";
import { LocalStorage } from "../Utils/app";
import { Link, useNavigate } from "react-router-dom";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import SideBar from "../Components/Sidebar";
import Loader from "../Components/Loader";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      // const token = LocalStorage.get("Token");
      const token = LocalStorage.get("User");
      console.log("token", token );
      
      
      if (!token) {
        setError("Token not found");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);        
        const userId = decoded.id || decoded._id;
        console.log("userID",userId);
        console.log("decoded",decoded.id);
        console.log("decodedID",decoded._id);
        
        if (!userId) throw new Error("User ID not found");

        const response = await getALLUserInfo(userId);
        setUser(response.data.data.userData);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    console.log(file)
    
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    console.log("🚀 Sending file:", file.name);
    console.log("🚀 FormData content:", formData.get("avatar"));

    try {
        const response = await updateAvatar(formData);
        if (response.data?.data?.avatar) {
            alert("🎉 Avatar updated successfully!");



            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            setError("Failed to update avatar");
          }
    } catch (err) {
        console.error("❌ Error updating avatar:", err.response?.data || err.message);
        setError("Failed to update avatar");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500"><Loader /></p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <HeaderPage />
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />

        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 flex items-center space-x-6">
            {/* Update Avatar Button */}
            <div className="flex flex-col items-center">
              <img
                src={user.avatar}
                alt={user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
              />
              <label className="mt-2 bg-gray-200 text-gray-700 px-4 py-1 rounded-lg text-sm cursor-pointer hover:bg-gray-300 transition">
                {uploading ? <Loader/>: "Update Avatar"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h3 className="text-gray-900 text-2xl font-semibold" style={{ fontFamily: "Source Code Pro" }}>
                {user.storedUserName.charAt(0).toUpperCase() + user.storedUserName.slice(1)}
              </h3>
              <h4 className="text-xl" style={{ fontFamily: "Montserrat" }}>
                {user.fullname.charAt(0).toUpperCase() + user.fullname.slice(1)}
              </h4>
              <p className="text-gray-500" style={{ fontFamily: "Inter" }}>
                <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">
                  {user.email}
                </a>
              </p>

              {/* Edit Profile Dropdown */}
              <div
                className="mt-6 flex justify-end relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Edit Details
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <ul className="py-2">
                      <li>
                        <button
                          onClick={() => navigate("/edit-account")}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Edit Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate("/profile/change-password")}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Change Password
                        </button>
                      </li>
                     
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Account;
