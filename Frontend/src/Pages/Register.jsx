import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // POST to backend register endpoint. The server should set an auth cookie (HttpOnly)
    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const text = await res.text();
        if (res.ok) {
          setMessage("✅ Registration successful. Redirecting...");
          // small delay so user can read the message
          setTimeout(() => navigate("/main"), 900);
        } else {
          // try to show JSON error or plain text
          try {
            const json = JSON.parse(text || "{}");
            setMessage(json.message || JSON.stringify(json) || text || "Registration failed");
          } catch (e) {
            setMessage(text || "Registration failed");
          }
        }
      })
      .catch((err) => {
        setMessage("Network error: " + (err.message || err));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="max-w-full text-center">
          <img
            src="https://i.pinimg.com/1200x/39/17/14/3917140e70c94b3ece795b9af73aba5f.jpg"
            alt="Register Illustration"
            className="rounded-3xl translate-x-20"
          />
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              ← Back to Home
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-black/10 p-8 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-normal font-montserrat text-black mb-2">
                Register
              </h2>
              <p className="text-sm text-gray-600 font-montserrat">
                Create your voting account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 focus:border-[#8B5CF6] focus:ring-0 focus:outline-none px-3 py-2 rounded-full"
                />
              </div>

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 focus:border-[#8B5CF6] focus:ring-0 focus:outline-none px-3 py-2 rounded-full"
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 focus:border-[#8B5CF6] focus:ring-0 focus:outline-none px-3 py-2 rounded-full"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-full font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            {/* Message */}
            {typeof message === 'string' && message && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-full">
                <p className="text-sm text-blue-800">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}