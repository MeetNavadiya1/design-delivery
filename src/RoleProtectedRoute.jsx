import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRoles }) => {
    // const location = useLocation();

    // // Replace with your real auth/role logic
    // const user = JSON.parse(localStorage.getItem('user'));
    // const userRole = user?.role; // e.g., 'agency', 'admin', 'client'

    // if (!user) {
    //     // Not logged in: redirect to login
    //     return <Navigate to="/login" state={{ from: location }} replace />;
    // }
    
    // if (!allowedRoles.includes(userRole)) {
    //     // Logged in but wrong role: redirect to an "Unauthorized" page
    //     return <Navigate to="/unauthorized" replace />;
    // }

    // Authorized: render child routes
    return <Outlet />;
};

export default RoleProtectedRoute