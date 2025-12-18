import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth, apiFetch} from '../auth/AuthContext';
import type {Profile} from "../models/types.ts";


export default function ProfilePage() {
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const [profile, setProfile] = useState<Profile | null>(user);
    const [name, setName] = useState(user?.name || '');
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const load = async () => {
        try {
            const data = await apiFetch<Profile>('/profile');
            setProfile(data);
            setName(data.name);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load profile');
        }
    };

    useEffect(() => {
        load();
    }, []);

    const updateName = async (error: React.FormEvent) => {
        error.preventDefault();
        setIsUpdatingName(true);

        try {
            await apiFetch('/profile', {method: 'PUT', body: JSON.stringify({name})});
            setMessage('Profile updated successfully!');
            load();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setIsUpdatingName(false);
        }
    };

    const changePassword = async (error: React.FormEvent) => {
        error.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await apiFetch('/profile/change-password', {
                method: 'POST',
                body: JSON.stringify({current_password: currentPassword, new_password: newPassword}),
            });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to change password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const confirmDeleteAccount = async () => {
        try {
            await apiFetch('/profile', {method: 'DELETE'});
            logout();
            navigate('/auth');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete account');
            closeDeleteModal();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (!profile) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="text-white">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white">Profile</h2>
                    <p className="mt-2 text-white">Manage your account settings</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-2">
                        <svg className="w-5 h-5 text-danger flex-shrink-0" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-danger text-sm">{error}</p>
                    </div>
                )}
                {message && (
                    <div className="mb-6 p-4 bg-success/10 border border-green-400 rounded-lg flex items-center gap-2">
                        <svg className="w-5 h-5 text-success flex-shrink-0 text-yellow-300" fill="none"
                             viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-green-400 text-sm">{message}</p>
                    </div>
                )}

                <div className="bg-secondary rounded-lg shadow-sm p-6 mb-6 border border-white">
                    <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-white w-20">Email:</span>
                            <span className="text-white">{profile.email}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-medium text-white w-20">Name:</span>
                            <span className="text-white">{profile.name}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary rounded-lg shadow-sm p-6 mb-6 border border-white">
                    <h3 className="text-xl font-semibold text-white mb-4">Update Name</h3>
                    <form onSubmit={updateName} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Your Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-primary border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition text-white"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isUpdatingName}
                                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg border border-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isUpdatingName ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-secondary rounded-lg shadow-sm p-6 mb-6 border border-white">
                    <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition hover:bg-blue-600"
                        >
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={changePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-primary border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-primary border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-primary border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition text-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setCurrentPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                        setError('');
                                    }}
                                    className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="bg-secondary rounded-lg shadow-sm p-6 border border-white">
                    <h3 className="text-xl font-semibold text-white mb-4">Account Actions</h3>
                    <div className="space-y-4">
                        <div
                            className="flex items-center justify-between p-4 bg-primary/50 rounded-lg border border-white">
                            <div>
                                <p className="font-medium text-white">Sign Out</p>
                                <p className="text-sm text-white">Sign out from your current session</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 bg-border text-white border border-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition"
                            >
                                Sign Out
                            </button>
                        </div>

                        <div
                            className="flex items-center justify-between p-4 border border-white bg-red-700 rounded-lg">
                            <div>
                                <p className="font-medium text-black">Delete Account</p>
                                <p className="text-sm text-black">Permanently delete your account and all data</p>
                            </div>
                            <button
                                onClick={openDeleteModal}
                                className="px-6 py-3 bg-red-950 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-secondary rounded-lg shadow-xl max-w-md w-full border border-white">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">Delete Account</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                                    <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <p className="text-red-300 font-medium mb-1">Warning: This action cannot be undone</p>
                                        <p className="text-red-200/80 text-sm">
                                            All your folders, notes, and account data will be permanently deleted.
                                        </p>
                                    </div>
                                </div>
                                <p className="text-white text-base">
                                    Are you absolutely sure you want to delete your account?
                                </p>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeDeleteModal}
                                        className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={confirmDeleteAccount}
                                        className="px-6 py-3 bg-red-950 text-white font-semibold rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger transition"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}