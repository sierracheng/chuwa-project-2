import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLogin, selectRole } from "@/redux/features/authenticate/authenticateSlice";

export const EmployeeRouteProtection = () => {
    const isLogin = useSelector(selectIsLogin);
    const role = useSelector(selectRole);

    if (!isLogin) {
        return <Navigate to="/login" />;
    }

    if (role !== "Employee") {
        return <Navigate to="/error" />;
    }

    return <Outlet />;
}