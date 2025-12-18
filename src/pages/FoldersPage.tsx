import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../auth/AuthContext';
import type { Folder } from "../models/types.ts";
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

export default function FoldersPage() {
    const [folders, setFolders] = useState<Folder[]>([]);

    const [name, setName] = useState('');
    const [editName, setEditName] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [folderToDelete, setFolderToDelete] = useState<number | null>(null);

    const load = async () => {
        setLoading(true);

        try {
            const data = await apiFetch<Folder[]>('/folders');
            const arr = Array.isArray(data) ? data : (data && Array.isArray((data as any).folders) ? (data as any).folders : []);
            setFolders(arr.map((f: any) => ({ id: f.id, name: f.name, createdAt: f.createdAt ?? f.created_at })));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load folders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/folders', { method: 'POST', body: JSON.stringify({ name }) });
            setName('');
            await load();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create folder');
        }
    };

    const openEditModal = (folder: Folder) => {
        setEditingFolder(folder);
        setEditName(folder.name);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingFolder(null);
        setEditName('');
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFolder) return;

        try {
            await apiFetch(`/folders/${editingFolder.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: editName }),
            });
            closeEditModal();
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to update folder');
        }
    };

    const remove = (id: number) => {
        setFolderToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (folderToDelete === null) return;

        try {
            await apiFetch(`/folders/${folderToDelete}`, { method: 'DELETE' });
            await load();
            closeDeleteModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete folder');
            closeDeleteModal();
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setFolderToDelete(null);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg" />
                        <p className="text-text-secondary">Loading folders...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-text-primary text-white">My Folders</h2>
                    <p className="mt-2 text-text-secondary text-white">Organize your notes into folders</p>
                </div>

                <form onSubmit={create} className="bg-secondary rounded-lg shadow-sm p-6 mb-8 border border-white">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="New folder name"
                                required
                            />
                        </div>
                        <Button type="submit" variant="primary" className="bg-amber-500">
                            <svg className="w-5 h-5 mr-2 " fill="currentColor" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create
                        </Button>
                    </div>
                </form>

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                        <p className="text-danger text-sm">{error}</p>
                    </div>
                )}

                {folders.length === 0 ? (
                    <div className="bg-secondary rounded-lg shadow-sm p-12 text-center border border-border ">
                        <div className="flex justify-center mb-4">
                            <svg className="w-16 h-16 text-text-secondary" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">No folders yet</h3>
                        <p className="text-text-secondary">Create your first folder above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                className="bg-secondary rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-border group"
                            >
                                <Link
                                    to={`/folders/${folder.id}`}
                                    className="block p-6 hover:bg-border/50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="w-10 h-10 text-accent group-hover:text-blue-500 transition-colors"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-text-primary break-words group-hover:text-accent transition-colors">
                                                {folder.name}
                                            </h3>
                                            <p className="text-xs text-text-secondary mt-2">
                                                Created {new Date(folder.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <div
                                    className="bg-primary/50 px-4 py-3 flex items-center justify-end gap-2 border-t border-border">
                                    <button
                                        onClick={() => openEditModal(folder)}
                                        className="p-2 text-text-secondary hover:text-accent rounded-lg transition-colors"
                                        title="Edit folder"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => remove(folder.id)}
                                        className="p-2 text-text-secondary hover:text-danger rounded-lg transition-colors"
                                        title="Delete folder"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={isModalOpen} onClose={closeEditModal} title="Edit Folder">
                <form onSubmit={saveEdit} className="space-y-4">
                    <Input
                        label="Folder Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={closeEditModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Modal>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-secondary rounded-lg shadow-xl max-w-md w-full border border-white">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-white mb-4">
                                Delete Folder
                            </h3>

                            <div className="space-y-4">
                                <p className="text-text-secondary text-base">
                                    Are you sure you want to delete this folder and all its notes? This action cannot be undone.
                                </p>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={closeDeleteModal}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={confirmDelete}
                                        className="bg-danger hover:bg-red-700 text-white"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}