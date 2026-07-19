import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

export function Card({ children, className = '', title, description }: CardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow-card rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-200 ${className}`}>
            {(title || description) && (
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                    {title && <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white">{title}</h3>}
                    {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
                </div>
            )}
            <div className="px-6 py-5">
                {children}
            </div>
        </div>
    );
}
