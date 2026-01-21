    import React from 'react';
    import type { BreadcrumbItems } from '@/types/types';

    interface BreadcrumbProps {
    items: BreadcrumbItems;
    className?: string; 
    }

    const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
    const labels = Object.keys(items);

    return (
        <nav className={`text-sm text-gray-600 ${className || ''}`} aria-label="Breadcrumb">
        <ol className="list-reset flex items-center space-x-2">
            {labels.map((label, idx) => {
            const url = items[label];
            const isFirst = idx === 0;
            const isLast = idx === labels.length - 1;

            return (
                <li key={label} className="flex items-center">
                {!isFirst && <span className="mx-2">/</span>}

                {isLast || url === '#' ? (
                    <span className="text-primary font-semibold">{label}</span>
                ) : (
                    <a href={url} className="text-gray-400 hover:underline">
                    {label}
                    </a>
                )}
                </li>
            );
            })}
        </ol>
        </nav>
    );
    };

    export default Breadcrumb;
