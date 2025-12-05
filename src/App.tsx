import {Routes, Route, Navigate, Link} from 'react-router-dom';
import './App.css';

import {AuthProvider, useAuth} from './auth/AuthContext';
import AuthPage from './pages/AuthPage';
import FoldersPage from './pages/FoldersPage';
import FolderDetailPage from './pages/FolderDetailPage.tsx';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import type {PrivateRouteProps, ShellProps} from "./models/types.ts";
import NotFoundPage from "./pages/NotFoundPage.tsx";

function PrivateRoute({children}: PrivateRouteProps) {
    const {token} = useAuth();
    return token ? <>{children}</> : <Navigate to="/auth" replace/>;
}

function Shell({children}: ShellProps) {
    const {token, user, logout} = useAuth();

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b dark:bg-gray-900 px-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo/Brand */}
                        <div className="flex items-center gap-8">
                            <Link to="/folders"
                                  className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                LCorpNotes
                            </Link>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-1">
                                <Link
                                    to="/folders"
                                    className="px-4 py-2 text-white hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
                                >
                                    Folders
                                </Link>
                                <Link
                                    to="/favorites"
                                    className="px-4 py-2 text-white hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
                                >
                                    Favorites
                                </Link>
                                <Link
                                    to="/profile"
                                    className="px-4 py-2 text-white hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
                                >
                                    Profile
                                </Link>
                            </div>
                        </div>

                        {/* User section */}
                        <div className="flex items-center gap-4">
                            {user && (
                                <span className="hidden sm:block text-sm text-white">
                                    {user.name}
                                </span>
                            )}
                            {token ? (
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-white hover:text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main>{children}</main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/auth" element={<AuthPage/>}/>
                <Route
                    path="/folders"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <FoldersPage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/folders/:id"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <FolderDetailPage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/favorites"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <FavoritesPage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Shell>
                                <ProfilePage/>
                            </Shell>
                        </PrivateRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/folders" replace/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </AuthProvider>
    );
}

export default App;