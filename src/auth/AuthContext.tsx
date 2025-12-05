import React, {createContext, useState, useContext, useEffect, type ReactNode, useMemo} from 'react';
import type {AuthContextType, User} from "../models/types.ts";


//Context
const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [token, setToken] = useState<string>(() => localStorage.getItem('token') || '');

    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    });

    // Adding token to LocalStorage
    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    // Adding user to LocalStorage
    useEffect(() => {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    }, [user]);

    const login = (newToken: string, newUser: User): void => {
        setToken(newToken);
        setUser(newUser);
    };

    const logout = (): void => {
        setToken('');
        setUser(null);
    };

    const value = useMemo(
        () => ({token, user, login, logout}),
        [token, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

// API fetch utility
// eslint-disable-next-line react-refresh/only-export-components
export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
    tokenOverride?: string
): Promise<T> {
    const base = 'http://127.0.0.1:5000/api';
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const tokenToUse = tokenOverride || (typeof window !== 'undefined' ? localStorage.getItem('token') : '');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    if (tokenToUse) headers['Authorization'] = `Bearer ${tokenToUse}`;

    const res = await fetch(base + path, {...options, headers});
    const text = await res.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;

    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    if (!res.ok) {
        const message = (data && (data.error || data.message)) || res.statusText;
        throw new Error(message);
    }

    return data;
}