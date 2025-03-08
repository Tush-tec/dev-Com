import React from "react";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";


const Contact = () => {
  return (
    <>
      <HeaderPage />
      <div className="container mx-auto px-6 py-12 bg-gray-50 text-gray-800">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 font-serif text-gray-900">
          Contact Me
        </h1>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-lg text-gray-600 text-center mb-6">
            Have questions or want to collaborate? Feel free to reach out!
          </p>

          {/* Contact Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Your Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Send Message
            </button>
          </form>

          {/* Contact Details */}
          <div className="mt-10 text-center">
            <p className="text-gray-700">📍 Location: Delhi</p>
            <p className="text-gray-700">📧 Email: tushar990022@gmail.com</p>
            <p className="text-gray-700">📞 Phone: 9711644308</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
