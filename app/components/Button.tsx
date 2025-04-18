'use client';

import React from 'react';
import cn from 'classnames';

type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl';
type ButtonFormat = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  format?: ButtonFormat;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({ 
  size = 'm', 
  format = 'primary', 
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  
  // Common classes for all buttons
  const baseClasses = 'rounded-md font-medium transition-all duration-300 flex items-center justify-center cursor-pointer';
  
  // Size-specific classes
  const sizeClasses = {
    xs: 'text-xs py-1 px-2',
    s: 'text-sm py-1.5 px-2.5',
    m: 'text-base py-2 px-4',
    l: 'text-lg py-3 px-5',
    xl: 'text-xl py-4 px-6',
  };
  
  // Format-specific classes
  const formatClasses = {
    primary: 'lightning-btn text-black font-bold hover:transform hover:-translate-y-1 hover:shadow-lg',
    secondary: 'border border-gray-600 text-gray-300 hover:bg-gray-800',
    tertiary: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled class
  const disabledClass = props.disabled ? 'opacity-70 cursor-not-allowed' : '';
  
  // Combine all classes
  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    formatClasses[format],
    widthClass,
    disabledClass,
    className
  );
  
  return (
    <button 
      className={buttonClasses} 
      {...props}
    >
      {children}
    </button>
  );
}