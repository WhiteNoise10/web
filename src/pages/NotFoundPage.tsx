import React from 'react';
import {Link} from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-center px-4">
            <h1 className="text-6xl font-extrabold text-accent">404</h1>
            <h2 className="text-3xl font-bold text-text-primary mt-4">Page Not Found</h2>
            <p className="text-text-secondary mt-2 max-w-md">
                Sorry, the page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <Link to="/" className="mt-8">
                <button
                    className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition">
                    Go to Homepage
                </button>
            </Link>
        </div>
    );
};

export default NotFoundPage;