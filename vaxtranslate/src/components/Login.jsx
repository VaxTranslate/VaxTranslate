import React, { useState } from "react";
import { Mail, Lock, User as UserIcon } from "lucide-react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const InputField = ({ icon: Icon, type, placeholder }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-gray-100">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {isLogin
                ? "Sign in to access your account"
                : "Sign up to get started"}
            </p>
          </div>

          <form className="mt-8 space-y-6">
            {!isLogin && (
              <InputField
                icon={UserIcon}
                type="text"
                placeholder="Full Name"
              />
            )}
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email address"
            />
            <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
            />

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium"
              >
                {isLogin ? "Sign in" : "Create account"}
              </button>
            </div>

            {isLogin && (
              <div className="text-sm text-center">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot your password?
                </a>
              </div>
            )}

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
