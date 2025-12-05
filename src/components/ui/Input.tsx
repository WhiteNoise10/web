import React, {type InputHTMLAttributes} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({label, id, error, className, ...props}) => {
    return (
        <div>
            {label &&
                <label htmlFor={id}
                       className="block text-sm font-medium text-text-secondary mb-1 text-white">{label}</label>}
            <input
                id={id}
                className={`w-full text-white px-3 py-2 bg-primary border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-accent focus:border-accent sm:text-sm text-text-primary ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
};

export default Input;