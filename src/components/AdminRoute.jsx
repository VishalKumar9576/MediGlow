import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        // Strict redirection to home for non-admins
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;
