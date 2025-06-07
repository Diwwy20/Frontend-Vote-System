import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = "/",
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ถ้าผู้ใช้ล็อกอินแล้ว ให้ redirect ไปหน้าที่เขาพยายามเข้าก่อนหน้า หรือหน้าหลัก
  if (isAuthenticated && user) {
    const from = (location.state as any)?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
