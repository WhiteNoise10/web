import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../auth/AuthContext';
import type { Note } from "../models/types.ts";
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

export default function FolderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const folderId = Number(id);

    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const data = await apiFetch<Note[]>(`/notes?folder_id=${folderId}`);
            setNotes(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    }, [folderId]);

    useEffect(() => {
        load();
    }, [folderId, load]);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch('/notes', {
                method: 'POST',
                body: JSON.stringify({ title, content, folder_id: folderId }),
            });
            setTitle('');
            setContent('');
            await load();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create note');
        }
    };

    const openEditModal = (note: Note) => {
        setEditingNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
        setIsModalOpen(true);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingNote(null);
        setEditTitle('');
        setEditContent('');
    };

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote) return;

        try {
            await apiFetch(`/notes/${editingNote.id}`, {
                method: 'PUT',
                body: JSON.stringify({ title: editTitle, content: editContent }),
            });
            closeEditModal();
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to update note');
        }
    };

    const remove = (id: number) => {
        setNoteToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (noteToDelete === null) return;

        try {
            await apiFetch(`/notes/${noteToDelete}`, { method: 'DELETE' });
            await load();
            closeDeleteModal();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to delete note');
            closeDeleteModal();
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setNoteToDelete(null);
    };

    const toggleFav = async (note: Note) => {
        try {
            await apiFetch(`/notes/${note.id}/favorite`, { method: 'POST' });
            await load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to toggle favorite');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner size="lg" />
                        <p className="text-text-secondary">Loading notes...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                <Link
                    to="/folders"
                    className="inline-flex items-center gap-2 text-accent hover:text-blue-500 mb-6 font-medium transition"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Folders
                </Link>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-text-primary">Folder Notes</h2>
                    <p className="mt-2 text-text-secondary">Manage your notes in this folder</p>
                </div>

                <form onSubmit={create} className="bg-secondary rounded-lg shadow-sm p-6 mb-8 border border-border">
                    <div className="space-y-4">
                        <Input
                            label="Note Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title"
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter note content"
                                rows={3}
                                className="w-full px-4 py-3 bg-primary border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-none text-text-primary"
                            />
                        </div>
                        <Button type="submit" variant="primary">
                            Add Note
                        </Button>
                    </div>
                </form>

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                        <p className="text-danger text-sm">{error}</p>
                    </div>
                )}

                {notes.length === 0 ? (
                    <div className="bg-secondary rounded-lg shadow-sm p-12 text-center border border-border">
                        <div className="flex justify-center mb-4">
                            <svg className="w-16 h-16 text-text-secondary" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">No notes yet</h3>
                        <p className="text-text-secondary">Create your first note above.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-border"
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-text-primary mb-2 break-words">
                                        {note.title}
                                    </h3>
                                    <p className="text-text-secondary text-sm whitespace-pre-wrap break-words line-clamp-3">
                                        {note.content || 'No content'}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <p className="text-xs text-text-secondary">
                                            Updated {new Date(note.updated_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="bg-primary/50 px-4 py-3 flex items-center justify-end gap-2 border-t border-border">
                                    <button
                                        onClick={() => toggleFav(note)}
                                        className={`p-2 rounded-lg transition-colors ${note.is_favorite
                                            ? 'text-warning hover:text-yellow-600'
                                            : 'text-text-secondary hover:text-warning'
                                            }`}
                                        title={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <svg className="w-5 h-5" fill={note.is_favorite ? 'currentColor' : 'none'}
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => openEditModal(note)}
                                        className="p-2 text-text-secondary hover:text-accent rounded-lg transition-colors"
                                        title="Edit note"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => remove(note.id)}
                                        className="p-2 text-text-secondary hover:text-danger rounded-lg transition-colors"
                                        title="Delete note"
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
            <Modal isOpen={isModalOpen} onClose={closeEditModal} title="Edit Note">
                <form onSubmit={saveEdit} className="space-y-4">
                    <Input
                        label="Title"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                        autoFocus
                    />
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 bg-primary border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-none text-text-primary"
                        />
                    </div>
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
                                Delete Note
                            </h3>

                            <div className="space-y-4">
                                <p className="text-text-secondary text-base">
                                    Are you sure you want to delete this note? This action cannot be undone.
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