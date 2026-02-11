
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface SuccessMessage {
  message: string;
}

const LoginPage = () => {
  const [aadhar, setAadhar] = useState<string>("");
  const [upas, setUpas] = useState<string>("");
  const [success, setSuccess] = useState<SuccessMessage | null>(null);
  const navigate = useNavigate()
  const sub = async (): Promise<void> => {
    const url = "http://localhost:3000/auth_user";
    const postData = {
      aadharNo: aadhar,
      password: upas,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      console.log(data);

      if (data.succeeded && data.jwtToken) {
        Cookies.set("authToken", data.jwtToken, { expires: 1 });
        setSuccess({ message: `✅ Login successful. Token saved in cookie.` });
        navigate("/");
      } else {
        setSuccess({
          message: `❌ Login failed. ${data.error || "Check credentials."}`,
        });
      }
    } catch (error) {
      setSuccess({ message: "⚠️ Something went wrong. Try again." });
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-green-50 font-sans p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border-t-4 border-blue-600">
        {/* 🇮🇳 Logo and Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            🇮🇳
          </div>
          <h1 className="text-2xl font-semibold text-blue-700 mt-3">Government Login Portal</h1>
          <p className="text-gray-500 text-sm">Secure access to citizen services</p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Aadhar Number"
            value={aadhar}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAadhar(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={upas}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUpas(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={sub}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            🔐 Login
          </button>
        </div>

        {/* Status Message */}
        {success && (
          <div
            className={`mt-4 p-2 text-sm rounded-md ${
              success.message.includes("successful")
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {success.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

