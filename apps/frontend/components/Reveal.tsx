'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    threshold?: number;
}

export function Reveal({ children, className = "", delay = 0, threshold = 0.1 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            {
                threshold: threshold
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const delayClass = delay === 100 ? 'reveal-delay-100' :
        delay === 200 ? 'reveal-delay-200' :
            delay === 300 ? 'reveal-delay-300' :
                delay === 400 ? 'reveal-delay-400' : '';

    return (
        <div ref={ref} className={`reveal ${isVisible ? 'active' : ''} ${delayClass} ${className}`}>
            {children}
        </div>
    );
}
