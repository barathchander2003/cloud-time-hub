
import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">TimeSheet</h1>
          <p className="text-gray-600">Employee Time Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
