import React, {type ButtonHTMLAttributes} from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = 'primary',
                                           isLoading = false,
                                           className = '',
                                           ...props
                                       }) => {
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-accent text-white border-accent hover:bg-blue-600 focus:ring-accent',
        secondary: 'bg-secondary text-text-primary border-border hover:bg-border focus:ring-accent',
        danger: 'bg-danger text-white border-danger hover:bg-red-600 focus:ring-danger',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Spinner size="sm"/> : children}
        </button>
    );
};

export default Button;