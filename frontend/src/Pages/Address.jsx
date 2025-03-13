import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { requestHandler } from "../Utils/app";
import { getSaveAddress, deleteSaveAddress } from "../Api/api";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import { PlusIcon } from "@heroicons/react/24/solid";
import SideBar from "../Components/Sidebar";
import { FaHome, FaLocationArrow, FaPhoneAlt } from "react-icons/fa";
import { MdLocationCity, MdMarkunreadMailbox } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    fetchAddresses(currentPage);
  }, []);

  const fetchAddresses = async (addressId,page) => {
    setLoading(true);
    await requestHandler(
      () => getSaveAddress(addressId, page),
      setLoading,
      (data) => {
        if (data.data && data.data.addresses) {
          setAddresses((prev) => [...prev, ...data.data.addresses]);
          setHasNextPage(data.data.hasNextPage);
          setCurrentPage(page);
        }
      },
      (error) => setError(error)
    );
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    await requestHandler(
      () => deleteSaveAddress(addressId),
      setLoading,
      () => {
        setAddresses((prev) => prev.filter((address) => address._id !== addressId));
      },
      (error) => alert("Failed to delete address: " + error)
    );
  };

  if (loading && addresses.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  if (error)
    return <div className="text-center text-xl text-red-500 p-6">{error}</div>;

  return (
    <>
      <HeaderPage />
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />

        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-black">Your Addresses</h2>
            <Link
              to="/address/create-address"
              className="bg-black text-white px-5 py-2 rounded-lg flex items-center hover:bg-gray-800 transition"
            >
              <PlusIcon className="w-5 h-5 mr-2" /> Add Address
            </Link>
          </div>

          {/* Address List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <div key={address._id} className="p-6 border rounded-lg bg-[#364153] shadow-md relative">
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                  title="Delete Address"
                >
                  <RiDeleteBin6Line className="w-5 h-5" />
                </button>

                <p className="flex items-center mb-2 gap-2">
                  <FaHome className="w-5 h-5" />
                  <span className="font-medium text-white">
                    {address.addressLine.houseNumber}, {address.addressLine.apartmentNumber}, {address.addressLine.street}
                  </span>
                </p>

                <p className="flex items-center mb-2 gap-2">
                  <FaLocationArrow className="w-5 h-5" />
                  <span className="font-medium text-white">
                    {address.addressLine.locality}, {address.addressLine.district}, {address.addressLine.city}
                  </span>
                </p>

                <p className="flex items-center mb-2 gap-2">
                  <MdLocationCity className="w-5 h-5" />
                  <span className="font-medium text-white">{address.state}</span>
                </p>

                <p className="flex items-center mb-2 gap-2">
                  <MdMarkunreadMailbox className="w-5 h-5" />
                  <span className="font-medium text-white">{address.addressLine.pincode}</span>
                </p>

                <p className="flex items-center mt-4 gap-2">
                  <FaPhoneAlt className="w-5 h-5" />
                  <span className="font-medium text-white">{address.phoneNumber}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="text-center mt-6">
              <button
                onClick={() => fetchAddresses(currentPage + 1)}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Address;
