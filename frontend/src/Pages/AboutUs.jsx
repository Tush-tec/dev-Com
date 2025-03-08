import React from "react";
import HeaderPage from "../Components/HeaderPage";
import Footer from "../Components/Footer";

const AboutUs = () => {
  return (
    <>
      <HeaderPage />
      <div className="container mx-auto px-6 py-12 bg-gray-50 text-gray-800">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 font-serif text-gray-900">
          The Story Behind My E-Commerce Project
        </h1>

        <div className="max-w-4xl mx-auto space-y-10 text-lg leading-relaxed font-light">
          {/* How It Started */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
              How It Started
            </h2>
            <p>
              This project was born out of my passion for web development and my goal of securing a job in the tech industry. 
              As a MERN stack developer, I wanted to build something meaningful—an application that showcases my skills while solving real-world e-commerce challenges.
            </p>
          </div>

          {/* The Problem We Solved */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
                The Problem I Solved
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Clunky User Interfaces</strong> – Many online stores are either too complex or lack a smooth shopping experience.</li>
              <li><strong>Limited Payment Options</strong> – Not all users prefer online payments; some still rely on Cash on Delivery.</li>
              <li><strong>Inefficient Address Management</strong> – Users struggle with selecting or updating addresses during checkout.</li>
              <li><strong>Security Concerns</strong> – Many platforms fail to provide a secure environment for transactions.</li>
            </ul>
            <p className="mt-4">
              With these problems in mind, I decided to build a <strong>fast, user-friendly, and secure</strong> e-commerce application.
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
              Key Features of This Project
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>User Authentication & Security 🔐</strong> – Secure login with JWT authentication and role-based access control.</li>
              <li><strong>Product & Category Management 🛍️</strong> – Categorized products, with dynamic admin controls.</li>
              <li><strong>Seamless Checkout Process 🛒</strong> – Users can save multiple addresses and select one during checkout.</li>
              <li><strong>Payment Integration 💳</strong> – Razorpay for online transactions and Cash on Delivery.</li>
              <li><strong>Optimized UI & Performance 🎨</strong> – Built with React, Tailwind CSS, and Framer Motion for a smooth experience.</li>
              <li><strong>Scalable Backend ⚡</strong> – Using Node.js, Express.js, and MongoDB for efficiency.</li>
            </ul>
          </div>

          {/* Why I Built This */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
              Why I Built This?
            </h2>
            <p>
              As a developer, I wanted to work on a <strong>real-world project</strong> that demonstrates my ability to handle full-stack development. 
              This e-commerce platform is not just a project—it’s a showcase of my skills in:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Building RESTful APIs</li>
              <li>Managing state & UI components</li>
              <li>Handling authentication & security</li>
              <li>Optimizing database queries</li>
            </ul>
          </div>

          {/* Future Goals */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
              Future Goals 🚀
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adding AI-powered product recommendations.</li>
              <li>Implementing a review & rating system.</li>
              <li>Enabling a wishlist feature.</li>
              <li>Improving order tracking with real-time updates.</li>
            </ul>
          </div>

          {/* Final Thoughts */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 font-sans">
              Final Thoughts
            </h2>
            <p>
              This project represents my journey in web development, solving real e-commerce problems, and preparing for opportunities in the tech industry. 
              I believe it showcases my skills and my ability to build <strong>scalable applications.</strong>
            </p>
            <p className="mt-3">
              🚀 <strong>If you're a recruiter or developer looking to collaborate, I'd love to connect!</strong>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
