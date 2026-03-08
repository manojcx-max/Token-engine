import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    headerAction?: React.ReactNode;
    fullWidth?: boolean;
}

export function Card({ children, title, icon, className = "", style = {}, headerAction, fullWidth = false }: CardProps) {
    return (
        <section
            className={`card-v2 ${className}`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                gridColumn: fullWidth ? '1 / -1' : 'auto',
                ...style
            }}
        >
            {(title || icon || headerAction) && (
                <div style={{
                    padding: '24px 32px',
                    borderBottom: '1px solid var(--border-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {icon && <div style={{ color: 'var(--text-secondary)' }}>{icon}</div>}
                        {title && (
                            <h3 style={{
                                fontWeight: 600,
                                margin: 0,
                                fontSize: '15px',
                                letterSpacing: '0.02em',
                                color: 'var(--text-primary)',
                                textTransform: 'uppercase'
                            }}>
                                {title}
                            </h3>
                        )}
                    </div>
                    {headerAction}
                </div>
            )}
            <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
        </section>
    );
}
