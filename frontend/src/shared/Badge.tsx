// src/shared/Badge.tsx
import React from 'react';

export type BadgeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  className = '',
}) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;