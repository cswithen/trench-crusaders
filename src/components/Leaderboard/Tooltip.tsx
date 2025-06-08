import * as React from 'react';
import { useTooltip, OverlayContainer } from 'react-aria';

interface TooltipProps {
    children: React.ReactNode;
    label: string;
    className?: string;
}

export function Tooltip({ children, label, className }: TooltipProps) {
    const triggerRef = React.useRef<HTMLSpanElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);
    const [isOpen, setOpen] = React.useState(false);
    const [coords, setCoords] = React.useState<{
        left: number;
        top: number;
    } | null>(null);
    const { tooltipProps } = useTooltip({ isOpen });

    // Position tooltip below the trigger
    React.useLayoutEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                left: rect.left + rect.width / 2,
                top: rect.bottom + 8, // 8px gap
            });
        }
    }, [isOpen]);

    return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
                ref={triggerRef}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                tabIndex={0}
                aria-describedby={isOpen ? 'tooltip' : undefined}
                style={{ outline: 'none' }}
            >
                {children}
            </span>
            {isOpen && coords && (
                <OverlayContainer>
                    <div
                        {...tooltipProps}
                        id="tooltip"
                        ref={tooltipRef}
                        role="tooltip"
                        className={className}
                        style={{
                            position: 'fixed',
                            left: coords.left,
                            top: coords.top,
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                        }}
                    >
                        {label}
                    </div>
                </OverlayContainer>
            )}
        </span>
    );
}
