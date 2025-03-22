import React from 'react';
import { CommonProps } from '../../../types/common.types';

interface AlertProps extends CommonProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  title?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  icon,
  title,
  dismissible = false,
  onDismiss,
  children,
  className = '',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-700',
      icon: 'text-blue-400 dark:text-blue-300',
      title: 'text-blue-800 dark:text-blue-300',
      content: 'text-blue-700 dark:text-blue-200',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-700',
      icon: 'text-green-400 dark:text-green-300',
      title: 'text-green-800 dark:text-green-300',
      content: 'text-green-700 dark:text-green-200',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-700',
      icon: 'text-yellow-400 dark:text-yellow-300',
      title: 'text-yellow-800 dark:text-yellow-300',
      content: 'text-yellow-700 dark:text-yellow-200',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-700',
      icon: 'text-red-400 dark:text-red-300',
      title: 'text-red-800 dark:text-red-300',
      content: 'text-red-700 dark:text-red-200',
    },
  };
  
  // Default icons for each variant
  const defaultIcons = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  };
  
  // Select the icon to display
  const displayIcon = icon || defaultIcons[variant];
  
  return (
    <div 
      className={`border-l-4 p-4 rounded-md ${variantStyles[variant].container} ${className}`}
      role="alert"
      {...props}
    >
      <div className="flex">
        {/* Icon */}
        {displayIcon && (
          <div className="flex-shrink-0">
            <span className={variantStyles[variant].icon}>
              {displayIcon}
            </span>
          </div>
        )}
        
        {/* Content */}
        <div className={`ml-3 ${displayIcon ? '' : 'ml-0'}`}>
          {/* Title (if provided) */}
          {title && (
            <h3 className={`text-sm font-medium ${variantStyles[variant].title}`}>
              {title}
            </h3>
          )}
          
          {/* Alert content */}
          <div className={`text-sm ${variantStyles[variant].content} ${title ? 'mt-2' : ''}`}>
            {children}
          </div>
        </div>
        
        {/* Dismiss button (if dismissible) */}
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 ${variantStyles[variant].icon} hover:bg-opacity-20 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant === 'info' ? 'blue' : variant === 'success' ? 'green' : variant === 'warning' ? 'yellow' : 'red'}-500`}
                onClick={onDismiss}
                aria-label="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;