import React from "react";
import LoginIMG from "../assets/Signin.jpg";

const SignIn = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      {/* ===== Background Image (FIXED) ===== */}
      <div
        className="fixed inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${LoginIMG})` }}
      />

      {/* ===== Overlay (FULL HEIGHT FIXED) ===== */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/70" />

      {/* ===== Glass Card ===== */}
      <div className="relative z-10 w-full max-w-4xl rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Image Section */}
          <div className="hidden md:block">
            <img
              src={LoginIMG}
              alt="Login"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Form Section */}
          <div className="p-8 sm:p-10 md:p-12 text-white">

            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              Welcome Back 👋
            </h2>
            <p className="text-white/70 mb-8 text-sm">
              Login to your account to continue
            </p>

            <form className="space-y-5">

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm mb-1 text-white/80">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="+94 7X XXX XXXX"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>

              {/* Forgot */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-purple-300 hover:text-purple-400"
                >
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition shadow-lg"
              >
                Sign In
              </button>

            </form>

            {/* Footer */}
            <p className="text-sm text-center text-white/70 mt-8">
              Don’t have an account?{" "}
              <a
                href="#"
                className="text-purple-300 font-medium hover:text-purple-400"
              >
                Register
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
