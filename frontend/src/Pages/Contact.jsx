import React, { useState, useEffect } from "react";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";
import { requestHandler } from "../Utils/app";
import { contactMe } from "../Api/api";

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null); 
  };


  const validateForm = () => {
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      return "All fields are required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);


    await requestHandler(
      () =>
        contactMe(formData),
      setSubmitting,
      () => {
        setSuccessMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      },
      (err) => setFormError(err)
    );
  };

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

          {/* Error & Success Messages */}
          {formError && <p className="text-center text-red-500">{formError}</p>}
          {successMessage && (
            <p className="text-center text-green-600">{successMessage}</p>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Your Phone Number</label>
              <input
                type="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your Phone Number"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-lg transition-all ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-700">📍 Location: Delhi</p>
            <p className="text-gray-700">📧 Email: tushar22009@gmail.com</p>
            <p className="text-gray-700">📞 Phone: 9711644308</p>
          </div>

          {/* Contact Details */}
        
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
