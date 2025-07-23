import React, { type MouseEventHandler } from 'react';
import './Card.css';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    handleClose?: MouseEventHandler<HTMLDivElement>;

}

export function Card({ children, className = '' }: CardProps) {
    return (
        <div className={`card ${className}`}>
            {children}
        </div>);
}

