import { Link } from "react-router-dom";
import { FaShoppingCart, FaMapMarkerAlt, FaHeart, FaUser, FaBell, FaQuestionCircle, FaCreditCard, FaClipboardList, FaTruck, FaGift, FaLock, FaHeadset } from "react-icons/fa";

const Dashboard = () => {
  const sections = [
    {
      title: "Overview",
      items: [
        { name: "Recent Orders", icon: <FaClipboardList size={40} />, path: "/orders" },
        { name: "Pending Actions", icon: <FaTruck size={40} />, path: "/pending-actions" },
        { name: "Loyalty Points", icon: <FaGift size={40} />, path: "/loyalty-points" },
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
        { name: "Personal Info", icon: <FaUser size={40} />, path: "/account" },
        { name: "Change Password", icon: <FaLock size={40} />, path: "/change-password" },
        { name: "Saved Addresses", icon: <FaMapMarkerAlt size={40} />, path: "/address" },
        { name: "Payment Methods", icon: <FaCreditCard size={40} />, path: "/payment-methods" },
      ],
    },
   
  ];

  return (
    <div className="flex flex-col items-center justify-center  p-6 w-full">
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
