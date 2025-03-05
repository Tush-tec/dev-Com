// import React, { useEffect, useState } from "react";

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8080/api/v1/users/account-details", {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => setUserData(data.data.userData))
//       .catch((err) => console.error("Error fetching user data:", err));
//   }, []);

//   if (!userData) return <div className="text-center mt-10">Loading...</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
//       <div className="bg-white p-4 shadow rounded-lg mb-6">
//         <p className="font-serif ">`Hello <span className="font-semibold"></span>{userData.email}  From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.`</p>
//       </div>
//       <h2 className="text-xl font-semibold mb-2">Orders</h2>
//       {userData.orders.map((order) => (
//         <div key={order._id} className="border p-4 mb-4 rounded-lg">
//           <p className="font-semibold">Order ID: {order._id}</p>
//           <p>Payment Method: {order.paymentMethod}</p>
//           <p>Status: {order.status}</p>
//           <p>Total Amount: ₹{order.totalAmount}</p>
//           <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

//           <h3 className="mt-2 font-semibold">Cart Items</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {order.cartDetails[0].items.map((item) => (
//               <div key={item._id} className="border p-2 rounded-lg flex">
//                 <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg mr-2" />
//                 <div>
//                   <p className="font-semibold">{item.name}</p>
//                   <p>Quantity: {item.quantity}</p>
//                   <p>Price: ₹{item.price}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <h3 className="mt-2 font-semibold">Shipping Address</h3>
//           <p>
//             {order.addressDetails[0].addressLine.street}, {order.addressDetails[0].addressLine.locality}, {order.addressDetails[0].addressLine.city}, {order.addressDetails[0].addressLine.pincode}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Dashboard;






import { Link } from "react-router-dom";
import { FaShoppingCart, FaMapMarkerAlt, FaHome, FaUser, FaBell, FaQuestionCircle, FaCreditCard, FaClipboardList, FaTruck, FaGift, FaLock, FaHeadset } from "react-icons/fa";
import { requestHandler } from "../Utils/app";
import { fetchUserAllInfo } from "../Api/api";
import { useEffect, useState } from "react";

const Dashboard = () => {
  
  const [userInfo, setUserInfo] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() =>{
    const fetchData = async ()=>{
      await requestHandler(
        fetchUserAllInfo,
        setLoading,
        (data) =>{
          console.log("Data",data.data.userData.orders);
          
          setUserInfo(data)
        },
        (errorMessage) =>{
          setError(errorMessage)
        }
      )
    }
    console.log(fetchUserAllInfo());
    
    fetchData()
  },[])

  const sections = [
    {
      title: "Overview",
      items: [
        { name: "Orders List", icon: <FaClipboardList size={40} />, path: "/profile/order" },
        { name: "Pending Actions", icon: <FaTruck size={40} />, path: "/pending-actions" },
      ],
    },
    {
      title: "Orders & Shopping History",
      items: [
        { name: "Active Orders", icon: <FaShoppingCart size={40} />, path: "/orders" },
        { name: "Past Orders", icon: <FaClipboardList size={40} />, path: "/order-history" },
        { name: "Track Order", icon: <FaTruck size={40} />, path: "/track-order" },
      ],
    },
    {
      title: "Account Management",
      items: [
        { name: "Personal Info", icon: <FaUser size={40} />, path: "/profile/personal-info" },
        { name: "Change Password", icon: <FaLock size={40} />, path: "/change-password" },
        { name: "Saved Addresses", icon: <FaMapMarkerAlt size={40} />, path: "/address" },
        { name: "Payment Methods", icon: <FaCreditCard size={40} />, path: "/payment-methods" },
      ],
    },
   
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full">

      {sections.map((section, idx) => (
        <div key={idx} className="mb-8 w-full max-w-full px-4">
          <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
          <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {section.items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="w-full h-40 flex flex-col items-center justify-center border border-gray-300 rounded-2xl shadow-lg bg-white hover:bg-gray-100 transition-all p-4"
              >
                <div className="mb-2">{item.icon}</div>
                <span className="text-lg font-semibold text-center">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


export default Dashboard;
