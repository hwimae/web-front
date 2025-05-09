import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  // Xác định các lớp CSS dựa trên variant
  let variantClasses = 'px-4 py-2 rounded-md transition-colors';
  
  if (variant === 'default') {
    variantClasses += ' bg-blue-600 hover:bg-blue-700 text-white';
  } else if (variant === 'destructive') {
    variantClasses += ' bg-red-600 hover:bg-red-700 text-white';
  } else if (variant === 'outline') {
    variantClasses += ' bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800';
  }
  
  return (
    <button 
      className={`${variantClasses} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};