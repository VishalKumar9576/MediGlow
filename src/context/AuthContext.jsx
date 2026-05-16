import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await fetchApi('/api/auth/profile');
                    setUser(userData);
                } catch (err) {
                    console.error('Session expired');
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const data = await fetchApi('/api/auth/login', {
            method: 'POST',
            body: { email, password }
        });
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data;
    };

    const signup = async (fullName, email, password, role = 'user') => {
        return await fetchApi('/api/auth/register', {
            method: 'POST',
            body: { fullName, email, password, role }
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
