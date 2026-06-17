import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen text-[#8b949e]">
      Loading...
    </div>
  );
}

  return isAuthenticated
    ? <>{children}</>
    : <Navigate to="/login" replace />;
}