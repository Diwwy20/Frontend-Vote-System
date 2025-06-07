import React from "react";
import { Quote } from "lucide-react";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-purple-600 rounded-full">
                <Quote className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                QuoteVault
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
              Join thousands of quote enthusiasts and start your collection
              today
            </p>
          </div>

          <div className="grid gap-6 max-w-md">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <blockquote className="text-gray-700 dark:text-gray-300 italic">
                "Be yourself; everyone else is already taken."
              </blockquote>
              <cite className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                — Oscar Wilde
              </cite>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
