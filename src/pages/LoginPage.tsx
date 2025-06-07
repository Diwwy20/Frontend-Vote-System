import React from "react";
import { Quote } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-full">
                <Quote className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                QuoteVault
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
              Discover, collect, and share inspiring quotes that move you
            </p>
          </div>

          <div className="grid gap-6 max-w-md">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <blockquote className="text-gray-700 dark:text-gray-300 italic">
                "The only way to do great work is to love what you do."
              </blockquote>
              <cite className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                — Steve Jobs
              </cite>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
