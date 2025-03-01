import React, { useEffect, useState } from 'react';
import { fetchUser, updateAvatar, updateAccountDetails, updatePassword } from '../Api/api';
import { jwtDecode } from 'jwt-decode';

const Account = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ username: '', fullname: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [avatar, setAvatar] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const token = localStorage.getItem('Token');
            if (!token) {
                setError('Token not found');
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const userId = decoded.id || decoded._id;

                if (!userId) {
                    setError('User ID not found in token');
                    setLoading(false);
                    return;
                }

                const response = await fetchUser(userId);
                setUser(response.data.data);
                setFormData({
                    username: response.data.data.username,
                    fullname: response.data.data.fullname,
                    email: response.data.data.email
                });
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatar(file);

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setUpdating(true);
            const response = await updateAvatar(formData);
            setUser((prevUser) => ({ ...prevUser, avatar: response.data.avatar }));
        } catch (err) {
            alert('Failed to update avatar');
        } finally {
            setUpdating(false);
        }
    };

    const handleAccountUpdate = async () => {
        try {
            setUpdating(true);
            const response = await updateAccountDetails(formData);
            setUser((prevUser) => ({ ...prevUser, ...response.data }));
            alert('Account updated successfully');
        } catch (err) {
            alert('Failed to update account details');
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordChange = async () => {
        try {
            setUpdating(true);
            await updatePassword(passwordData);
            alert('Password updated successfully');
        } catch (err) {
            alert('Failed to change password');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-96 flex flex-col items-center space-y-6">
            {user && (
                <>
                    <div className="flex flex-col items-center">
                        <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full" />
                        <input type="file" className="mt-2" onChange={handleAvatarChange} disabled={updating} />
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-600">Username:</label>
                        <input
                            type="text"
                            className="border p-2 w-full rounded"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-600">Full Name:</label>
                        <input
                            type="text"
                            className="border p-2 w-full rounded"
                            value={formData.fullname}
                            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-600">Email:</label>
                        <input type="email" className="border p-2 w-full rounded" value={formData.email} disabled />
                    </div>

                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
                        onClick={handleAccountUpdate}
                        disabled={updating}
                    >
                        {updating ? 'Updating...' : 'Update Account'}
                    </button>

                    <hr className="w-full border-gray-300" />

                    <div className="w-full">
                        <label className="block text-gray-600">Current Password:</label>
                        <input
                            type="password"
                            className="border p-2 w-full rounded"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-gray-600">New Password:</label>
                        <input
                            type="password"
                            className="border p-2 w-full rounded"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                    </div>

                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4"
                        onClick={handlePasswordChange}
                        disabled={updating}
                    >
                        {updating ? 'Changing Password...' : 'Change Password'}
                    </button>
                </>
            )}
        </div>
    );
};

export default Account;
