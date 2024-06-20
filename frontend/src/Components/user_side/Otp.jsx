import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleEmailChange = (e) => {
    // New handler for email input
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/account/api/validate-otp`,
        {
          email: email, // Sending email
          otp: otp,
        }
      );
      console.log(response);

      if (response.status === 200) {
        setMessage("Email verified successfully!");
        // handle token storage or redirection here
        return navigate("/login");
      }
    } catch (error) {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm mt-4">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            OTP:
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default Otp;
