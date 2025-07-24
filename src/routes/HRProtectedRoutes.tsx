import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole, selectIsLogin } from "@/redux/features/authenticate/authenticateSlice";

export const HRProtectedRoutes = () =>{
    const role = useSelector(selectRole);
    const isLogin = useSelector(selectIsLogin);

    if (!isLogin) {
        return <Navigate to="/login"/>;
    }

    if (role !== "HR") {
        return <Navigate to="/error" />;
    }

    return <Outlet />;
}