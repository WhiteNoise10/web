import React, {type ReactNode} from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="min-h-screen bg-primary flex flex-col dark:bg-gray-900 px-4">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
                {children}
            </main>
            <footer className="bg-secondary/50 text-center py-4 text-text-secondary text-sm border-t border-border">
                <p>&copy; {new Date().getFullYear()} LCorpNotes. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;