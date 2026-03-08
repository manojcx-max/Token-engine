import React from 'react';

export function BrandLogo({ size = 24, className = "" }: { size?: number, className?: string }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size + 12}px`,
            height: `${size + 12}px`,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <img
                src="/logo.png"
                alt="TokenEngine Logo"
                width={size}
                height={size}
                className={className}
                style={{
                    objectFit: 'contain',
                    filter: 'var(--logo-filter, none)',
                    transition: 'filter 0.3s ease'
                }}
            />
        </div>
    );
}
