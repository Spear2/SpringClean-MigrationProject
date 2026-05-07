import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const ProtectedRoute = ({ children, requiredType }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login/ChooseYourRole" replace />;

  if (requiredType && user.type !== requiredType)
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
