import React, { useEffect, useState } from 'react';
import { fetchUser, getALLUserInfo } from '../Api/api';
import { jwtDecode } from 'jwt-decode';
import { LocalStorage } from '../Utils/app';
import { Link } from 'react-router-dom';
import HeaderPage from '../Components/HeaderPage';
import Footer from '../Components/Footer';
import SideBar from '../Components/Sidebar';
import Loader from '../Components/Loader';

const Account = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const token = LocalStorage.get('Token');
            if (!token) {
                setError('Token not found');
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const userId = decoded.id || decoded._id;
                if (!userId) throw new Error('User ID not found');

                const response = await getALLUserInfo(userId); // Use correct `userId`
                console.log(response.data.data.userData);
                
                setUser(response.data.data.userData);
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    if (loading) return <p className="text-center text-gray-500"><Loader/></p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <>
            <HeaderPage />
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar on the Left */}
                <SideBar />

                {/* User Details on the Right */}
                <div className="flex-1 p-6">
                    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
                        {user && (
                            <>
                                <div className="flex items-center space-x-6">
                                    {/* Enlarged Avatar */}
                                    <img 
                                        src={user.avatar} 
                                        alt={user.username.charAt(0).toUpperCase() + user.username.slice(1)} 
                                        className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
                                    />
                                    <div>
                                        <h3 className="text-gray-900 text-2xl font-semibold" style={{ fontFamily: "Source Code Pro" }}>
                                            {user.storedUserName.charAt(0).toUpperCase() + user.storedUserName.slice(1)}
                                        </h3>
                                        <h4 className="text-xl" style={{ fontFamily: "Montserrat" }}>
                                            {user.fullname.charAt(0).toUpperCase() + user.fullname.slice(1)}
                                        </h4>
                                        <p className="text-gray-500" style={{ fontFamily: "Inter" }}>
                                            <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">{user.email}</a>
                                        </p>
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold">Address Details</h3>
                                    <div className="mt-2 bg-gray-100 p-4 rounded-md">
                                        {user.addressDetails && user.addressDetails.length > 0 ? (
                                            user.addressDetails.map((address, index) => (
                                                <div key={index} className="mb-2 border-b pb-2">
                                                    <p className="text-gray-700"><strong>House Number:</strong> {address.addressLine.houseNumber}, <strong>Apartment Number:</strong> {address.addressLine.apartmentNumber}</p>
                                                    <p className="text-gray-700"><strong>Street:</strong> {address.addressLine.street}, <strong>Locality:</strong> {address.addressLine.locality}</p>
                                                    <p className="text-gray-700"><strong>District:</strong> {address.addressLine.district}, <strong>City:</strong> {address.addressLine.city}</p>
                                                    <p className="text-gray-700"><strong>State:</strong> {address.state}, <strong>Pincode:</strong> {address.addressLine.pincode}</p>
                                                    <p className="text-gray-500"><strong>Phone:</strong> {address.phoneNumber}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No addresses available</p>
                                        )}
                                    </div>
                                </div>

                                {/* Edit Button */}
                                <div className="mt-6 flex justify-end">
                                    <Link to="/edit-account" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Edit Details</Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Account;
