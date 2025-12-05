import {useEffect, useState} from 'react';
import {apiFetch} from '../auth/AuthContext';
import type {Note} from "../models/types.ts";


export default function FavoritesPage() {
    const [notes, setNotes] = useState<Note[]>([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);

        try {
            const allNotes = await apiFetch<Note[]>('/notes');
            setNotes(allNotes.filter((note) => note.is_favorite));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const toggleFavorite = async (noteId: number) => {
        try {
            await apiFetch(`/notes/${noteId}/favorite`, {method: 'POST'});
            setNotes(notes.filter((n) => n.id !== noteId));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update favorite');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                    <p className="text-white">Loading favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white">Favorite Notes</h2>
                    <p className="mt-2 text-white">Your starred notes in one place</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg">
                        <p className="text-danger text-sm">{error}</p>
                    </div>
                )}

                {notes.length === 0 ? (
                    <div className="bg-secondary rounded-lg shadow-sm p-12 text-center border border-white">
                        <div className="flex justify-center mb-4">
                            <svg
                                className="w-16 h-16 text-yellow-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No favorite notes yet</h3>
                        <p className="text-white">Star notes to see them here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-secondary rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-border"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-white flex-1 break-words">
                                            {note.title}
                                        </h3>
                                        <button
                                            onClick={() => toggleFavorite(note.id)}
                                            className="flex-shrink-0 ml-2 text-warning hover:text-yellow-600 transition-colors"
                                            title="Remove from favorites"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-white text-sm line-clamp-3 whitespace-pre-wrap break-words">
                                        {note.content || 'No content'}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <p className="text-xs text-white">
                                            Updated {new Date(note.updated_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="bg-primary/50 px-6 py-3 border-t border-border">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-accent">
                                            {note.folder_id ? `Folder #${note.folder_id}` : 'No folder'}
                                        </span>
                                        <button className="text-xs text-accent hover:text-blue-500 font-medium">
                                            View →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}