import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isVisible, setIsVisible] = useState(false);
    const [infoText, setInfoText] = useState<string | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Hide custom cursor if hovering over the scrollbar area
            const isOverScrollbar = window.innerWidth - e.clientX <= 20;

            if (isOverScrollbar) {
                if (isVisible) setIsVisible(false);
                document.documentElement.classList.remove('hide-cursor');
                return;
            }

            document.documentElement.classList.add('hide-cursor');
            setMousePosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);

            const target = e.target as HTMLElement;
            // Traverse up to find data-cursor-info attribute
            const infoElement = target.closest('[data-cursor-info]');
            if (infoElement) {
                setInfoText(infoElement.getAttribute('data-cursor-info'));
            } else {
                setInfoText(null);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 2147483647,
                transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            {/* Pointer SVG - Black Fill, White Stroke */}
            <svg
                width="22"
                height="28"
                viewBox="0 0 16 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    transform: 'translate(-2px, -2px)', // To align tip perfectly
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                }}
            >
                <path
                    d="M1.66667 1.66663L11.967 11.967H6.66667L10.3333 19.3333L7.66667 20.6666L4 13.3333L1.66667 15.6666V1.66663Z"
                    fill="#000000"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Informational Popup Tooltip */}
            <div
                style={{
                    opacity: infoText ? 1 : 0,
                    transform: infoText ? 'scale(1)' : 'scale(0.8)',
                    transition: 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    backgroundColor: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.02em',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-default)'
                }}
            >
                {infoText || ''}
            </div>
        </div>
    );
}
