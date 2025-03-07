import React, { useEffect, useState } from "react";
import { getALLUserInfo } from "../Api/api";
import { jwtDecode } from "jwt-decode";
import { LocalStorage } from "../Utils/app";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";

const PersonalInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const token = LocalStorage.get("Token");
      if (!token) {
        setError("Token not found");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id || decoded._id;
        if (!userId) throw new Error("User ID not found");

        const response = await getALLUserInfo();
        setUser(response.data.data.userData);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <HeaderPage />
      <div className="max-w-5xl mx-auto mt-6 bg-gray-900 text-white rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Section - Profile Card */}
        <div className="w-full md:w-1/3 bg-gray-800 p-6 flex flex-col items-center text-center">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-md"
          />
          <h2 className="text-2xl font-semibold mt-4">{user?.fullname}</h2>
          <p className="text-gray-400">{user?.storedUserName}</p>


          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-400 rounded-full border p-3 hover:text-white text-lg">
              <FaLinkedinIn />
            </a>
            <a href="#" className="text-gray-400 rounded-full border p-3 hover:text-white text-lg">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 rounded-full border p-3 hover:text-white text-lg">
              <FaTwitter />
            </a>
          </div>
        </div>


        <div className="w-full md:w-2/3 bg-gray-700 p-6 md:p-8 ">
          <h2 className="text-3xl font-bold">{user?.fullname}</h2>
          <p className="text-gray-400 text-lg mt-4">{user?.storedUserName}</p>
          <p className="text-gray-400 text-lg"> 
            <span className="font-semibold">Log-in with:</span> {user?.username}
          </p>


          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white">Address Information</h3>
            <div className="mt-3 space-y-6">
              {user?.addressDetails?.length > 0 ? (
                user.addressDetails.map((address, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800 rounded-md shadow space-y-2"
                  >
                    <p>
                      <strong>House No.:</strong> {address.addressLine.houseNumber}
                    </p>
                    <p>
                      <strong>Street:</strong> {address.addressLine.street},{" "}
                      <strong>Locality:</strong> {address.addressLine.locality}
                    </p>
                    <p>
                      <strong>City:</strong> {address.addressLine.city},{" "}
                      <strong>State:</strong> {address.state}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {address.addressLine.pincode}
                    </p>
                    <p>
                      <strong>Phone:</strong> {address.phoneNumber}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No addresses available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
              &nbsp;
              &nbsp;
              &nbsp;
      <Footer />
    </>
  );
};

export default PersonalInfo;
