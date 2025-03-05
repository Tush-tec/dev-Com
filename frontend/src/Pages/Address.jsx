import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { requestHandler } from "../Utils/app";
import { getSaveAddress } from "../Api/api";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import { PlusIcon } from "@heroicons/react/24/solid";
import SideBar from "../Components/Sidebar";
import { FaBuilding, FaHome, FaLocationArrow, FaPhoneAlt } from "react-icons/fa";
import { MdLocationCity, MdMarkunreadMailbox } from "react-icons/md";

const Address = () => {
  const { addressId } = useParams();
  console.log("📌 Address ID:", addressId);

  const [saveAddress, setSaveAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!addressId) return;
    requestHandler(
      () => getSaveAddress(addressId),
      setLoading,
      (data) => {
        console.log("✅ API Response:", data.data);
        setSaveAddress(data.data); // It's an object, not an array
      },
      (error) => {
        console.error("❌ API Error:", error);
        setError(error);
      }
    );
  }, [addressId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  if (error)
    return <div className="text-center text-xl text-red-500 p-6">{error}</div>;

  if (!saveAddress)
    return <div className="text-center text-xl p-6">No address found</div>;

  return (
    <>
      <HeaderPage />
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-black">Your Address</h2>
            <Link
              to="/add-address"
              className="bg-black text-white px-5 py-2 rounded-lg flex items-center hover:bg-gray-800 transition"
            >
              <PlusIcon className="w-5 h-5 mr-2" /> Add Address
            </Link>
          </div>

          {/* Address Card */}
          <div className="max-w-xl">
            <div className="p-6 border rounded-lg bg-[#364153] shadow-md">
              <div className="flex items-center mb-4">
                <FaLocationArrow className="w-5 h-5  mr-3" />
                <span className="text-lg font-medium text-white">
                  {saveAddress.addressLine.street}, {saveAddress.addressLine.locality}, {saveAddress.addressLine.city}
                </span>
              </div>

              <p className="flex items-center mb-5 gap-2">
                <FaHome className="w-5 h-5 " />
                <span className="font-medium text-white">
                  {saveAddress.addressLine.houseNumber}, Apartment: {saveAddress.addressLine.apartmentNumber}
                </span>
              </p>

              <p className="flex items-center mb-2 gap-2">
                <FaBuilding className="w-5 h-5" />
                <span className="font-medium text-white">{saveAddress.addressLine.district}</span>
              </p>

              <p className="flex items-center mb-2 gap-2">
                <MdLocationCity className="w-5 h-5 " />
                <span className="font-medium text-white">{saveAddress.state}</span>
              </p>

              <p className="flex items-center mb-2 gap-2">
                <MdMarkunreadMailbox className="w-5 h-5 " />
                <span className="font-medium text-white">{saveAddress.addressLine.pincode}</span>
              </p>

              <p className="flex items-center mt-4 gap-2">
                <FaPhoneAlt className="w-5 h-5 " />
                <span className="font-medium text-white">{saveAddress.phoneNumber}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Address;
