import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`glass rounded-3xl p-6 mb-4 transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
  >
    {children}
  </div>
);
