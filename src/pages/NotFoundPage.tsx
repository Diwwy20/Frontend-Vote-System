import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    if (location.key !== "default") {
      navigate(-1); // กลับไปยังหน้าก่อนหน้า
    } else {
      navigate("/"); // ถ้าไม่มีหน้าเดิม ให้กลับไปหน้าแรก
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
        <Search className="w-10 h-10 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        404 - Page Not Found
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md text-center">
        The page you are looking for does not exist.
      </p>
      <Button
        onClick={handleGoBack}
        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Go Back
      </Button>
    </div>
  );
};

export default NotFoundPage;
