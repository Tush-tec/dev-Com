import React, { useState } from "react";
import { requestHandler } from "../Utils/app";
import { createAddress } from "../Api/api";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";



const CreateAddress = () => {
    const [formData, setFormData] = useState({
        addressLine: {
            street: "",
            houseNumber: "",
            apartmentNumber: "",
            locality: "",
            district: "",
            city: "",
            pincode: ""
        },
        state: "",
        phoneNumber: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name.includes("addressLine") ? "addressLine" : name]: name.includes("addressLine")
                ? { ...prev.addressLine, [name.split(".")[1]]: value }
                : value
        }));
    };



    const handleSubmit =async (e) => {
        e.preventDefault();
        await requestHandler(
            () => createAddress(formData),
            setLoading,
            (data) => {
                console.log("Address created successfully:", data);
                window.location.href = "/checkout";
            },
            (error) => {
                console.log("Error creating address:", error);
                setError(error);
            }
        );
    };

    return (
        <>
        <HeaderPage/>
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10 mb-10 ">
            <div className="flex justify-center items-center flex-col">
                {error && <div className="w-80 text-center text-red-500">{error}</div>}
            </div>
            <h2 className="text-xl text-center font-semibold mb-4">Billing Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block">Street</label>
                        <input type="text" name="addressLine.street" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block">House Number</label>
                        <input type="text" name="addressLine.houseNumber" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block">Apartment Number</label>
                        <input type="text" name="addressLine.apartmentNumber" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block">Locality</label>
                        <input type="text" name="addressLine.locality" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block">District</label>
                        <input type="text" name="addressLine.district" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block">City</label>
                        <input type="text" name="addressLine.city" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block">Pincode</label>
                        <input type="text" name="addressLine.pincode" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block">State</label>
                        <input type="text" name="state" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label className="block">Phone Number</label>
                    <input type="text" name="phoneNumber" className="border border-gray-300 p-2 rounded w-full" onChange={handleChange} />
                </div>
                <button type="submit" className=" w-30  mt-4 bg-black text-white p-2 rounded-md" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
        <Footer/>
        </>
    );
};

export default CreateAddress;
