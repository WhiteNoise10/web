import React, {useState, useRef, useEffect} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {LogOut, User, Star, Folder, Menu, X} from 'lucide-react';
import {useAuth} from "../../auth/AuthContext.tsx";

const Navbar: React.FC = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const navLinkClass = ({isActive}: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:bg-border hover:text-text-primary'
        }`;

    const mobileNavLinkClass = ({isActive}: { isActive: boolean }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
            isActive
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:bg-border hover:text-text-primary'
        }`;

    return (
        <nav className="bg-secondary border-b border-border sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 text-text-primary font-bold text-xl">
                            LCorpNotes
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/folders" className={navLinkClass}>
                                    <Folder size={18}/> Folders
                                </NavLink>
                                <NavLink to="/favorites" className={navLinkClass}>
                                    <Star size={18}/> Favorites
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="relative" ref={profileRef}>
                                <div>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="bg-accent rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div
                                            className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                                            {user?.name.charAt(0).toUpperCase()}
                                        </div>
                                    </button>
                                </div>
                                {profileOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-secondary border border-border ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <NavLink
                                            to="/profile"
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-border hover:text-text-primary"
                                        >
                                            <User size={16}/> Profile
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-border hover:text-text-primary"
                                        >
                                            <LogOut size={16}/> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="bg-secondary inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? <X/> : <Menu/>}
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink to="/folders" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            <Folder size={18}/> Folders
                        </NavLink>
                        <NavLink to="/favorites" className={mobileNavLinkClass}
                                 onClick={() => setMobileMenuOpen(false)}>
                            <Star size={18}/> Favorites
                        </NavLink>
                    </div>
                    <div className="pt-4 pb-3 border-t border-border">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <div
                                    className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none text-text-primary">{user?.name}</div>
                                <div
                                    className="text-sm font-medium leading-none text-text-secondary mt-1">{user?.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <NavLink
                                to="/profile"
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <User size={16}/> Profile
                            </NavLink>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:text-text-primary hover:bg-border"
                            >
                                <LogOut size={16}/> Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;